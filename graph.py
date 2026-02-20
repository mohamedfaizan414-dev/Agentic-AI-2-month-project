from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_core.tools import tool
from langchain_groq import ChatGroq
from langchain.agents import create_agent
from langsmith import Client
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage,SystemMessage
from typing import TypedDict, List, Optional, Annotated
from dotenv import load_dotenv
from datetime import datetime
import dateparser
import json
import re
import requests



load_dotenv()

# LLM SETUP

llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0,
    model_kwargs={"tool_choice": "auto"}
)

client = Client()
prompt = client.pull_prompt("hwchase17/react") 
prompt_template_string = prompt.template



# STATE

class TravelState(TypedDict):
    
    messages: Annotated[list[BaseMessage], add_messages]
    conversation_id: int
    travel_data: dict
    current_location: Optional[str]
    destination: Optional[str]
    departure_date: Optional[str]
    return_date: Optional[str]
    budget: Optional[float]
    travelers: Optional[int]
    validation_issue: Optional[dict]
    stage: Optional[str]
    itinerary: Optional[str]

# SAFE JSON EXTRACTOR

def safe_json_extract(text):
    try:
        match = re.search(r"\{[\s\S]*?\}", text)
        if match:
            return json.loads(match.group())
    except:
        pass
    return {}

# DATE RESOLUTION (DETERMINISTIC)

def resolve_date(date_str):
    if not date_str:
        return None, "MISSING_DATE"

    parsed = dateparser.parse(
        date_str,
        settings={"PREFER_DATES_FROM": "future"}
    )

    if not parsed:
        return None, "INVALID_FORMAT"

    return parsed.date(), None

# NODE 1 — EXTRACT STRUCTURED INFO

def extract(state: TravelState):

    today = datetime.today().date()

    prompt = f"""
    Today's date is: {today}

    Extract travel details from the conversation.

    Return ONLY valid JSON:
    {{
      "current_location": string or null,
      "destination": string or null,
      "departure_date": string or null,
      "return_date": string or null,
      "budget": number or null,
      "travelers": number or null
    }}

    Conversation:
    {state["messages"]}
    """

    response = llm.invoke(prompt)
    data = safe_json_extract(response.content)

    return {
        "current_location" : data.get("current_location") or state.get("current_location"),
        "destination": data.get("destination") or state.get("destination"),
        "departure_date": data.get("departure_date") or state.get("departure_date"),
        "return_date": data.get("return_date") or state.get("return_date"),
        "budget": data.get("budget") or state.get("budget"),
        "travelers": data.get("travelers") or state.get("travelers"),
    }

#tools

search = DuckDuckGoSearchRun()

@tool
def search_tool(query:str):
    """- If the user asks about weather, prices, places, or anything uncertain use the search_tool."""

    a= search.invoke(query)

    print("tool is used")
    return a

    

@tool
def check_train_availability(source: str, destination: str, date: str) -> str:
    """
    Check train availability between two stations on a specific date.
    Input should be station codes (e.g., 'NDLS' for Delhi) and date in DD-MM-YYYY format.
    """
    url = "https://irctc-api2.p.rapidapi.com/trainAvailability"
    
    # These match your curl --header flags
    headers = {
        "x-rapidapi-host": "irctc-api2.p.rapidapi.com",
        "x-rapidapi-key": "cee79b1dfcmshaf2a36793f1a265p134b6djsn3fa420931403" 
    }
    
    # These match your curl --url query parameters
    params = {
        "source": source,
        "destination": destination,
        "date": date
    }
    print("train")
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status() # Check for errors
        return str(response.json()) # LangChain tools must return a string
    except Exception as e:
        return f"Error fetching train data: {str(e)}"
    

@tool
def currency_exchanger(base_amount:float,base_currency:str , target_currency:str) -> float:
    """ This function converts any currency from the base currency to target currency  """
    url = f"https://v6.exchangerate-api.com/v6/a056af0e661eeb573f83141f/pair/{base_currency}/{target_currency}"
    response = requests.get(url)
    data = response.json()
    convertion_rate  = data["conversion_rate"]
    print("exchange tool used")
    return convertion_rate

#agent setup

tools = [search_tool,currency_exchanger,check_train_availability]

agent = create_agent(
    model=llm,
    tools= tools,
    system_prompt=prompt_template_string
)



# NODE 2 — DETERMINISTIC VALIDATION

def validate_logic(state: TravelState):

    dep_raw = state.get("departure_date")
    ret_raw = state.get("return_date")
    budget = state.get("budget")
    travelers = state.get("travelers")

    # DATE VALIDATION
    if dep_raw or ret_raw:

        dep_date, dep_error = resolve_date(dep_raw)
        ret_date, ret_error = resolve_date(ret_raw)

        if dep_error:
            return {
                "validation_issue": {
                    "type": "DATE_ERROR",
                    "field": "departure_date",
                    "reason": dep_error
                }
            }

        if ret_error:
            return {
                "validation_issue": {
                    "type": "DATE_ERROR",
                    "field": "return_date",
                    "reason": ret_error
                }
            }

        if ret_date <= dep_date:
            return {
                "validation_issue": {
                    "type": "DATE_LOGIC_ERROR",
                    "reason": "RETURN_BEFORE_DEPARTURE",
                    "departure": dep_date.isoformat(),
                    "return": ret_date.isoformat()
                }
            }

        state["departure_date"] = dep_date.isoformat()
        state["return_date"] = ret_date.isoformat()

    # BUDGET VALIDATION
    if budget is not None:

        if budget < 100:
            return {
                "validation_issue": {
                    "type": "BUDGET_TOO_LOW",
                    "budget": budget
                }
            }

        if travelers and (budget / travelers) < 200:
            return {
                "validation_issue": {
                    "type": "BUDGET_PER_PERSON_TOO_LOW",
                    "budget": budget,
                    "travelers": travelers
                }
            }

    return {
        "validation_issue": None,
        "departure_date": state.get("departure_date"),
        "return_date": state.get("return_date")
    }



# NODE 3 — THINKING BRAIN

def thinking_brain(state: TravelState):

    last_user_message = state["messages"][-1].content
    validation_issue = state.get("validation_issue")
     # FULL conversation:
    # {state["messages"]}
    prompt = f"""
    ### ROLE
You are a premium, intelligent travel consultant. Your goal is to gather travel details, resolve validation errors, and provide expert recommendations.

### CURRENT TRAVEL CONTEXT
- Current Location: {state.get("current_location")}
- Destination: {state.get("destination")}
- Departure Date: {state.get("departure_date")}
- Return Date: {state.get("return_date")}
- Total Budget: {state.get("budget")}
- Number of Travelers: {state.get("travelers")}

### ACTIVE VALIDATION ISSUES
- Issue: {validation_issue if validation_issue else "None"}

### OPERATIONAL INSTRUCTIONS
1. ADDRESS ERRORS: If a "Validation Issue" is present, prioritize explaining it naturally to the user and ask for the specific corrected information.
2. TOOL USAGE: Use the 'search_tool' or 'currency_exchanger' if the user asks for real-time data like weather, exchange rates, or local events.
3. CONVERSATIONAL FLOW: Respond naturally. If information is missing (e.g., no destination or budget), ask for it politely.
4. PLANNING: If all necessary information is known, propose a brief, high-level travel plan to the user.

### OUTPUT TRIGGERS
- If the user explicitly asks for the final itinerary OR agrees to the proposed plan: Respond ONLY with the word "FINALIZE".
- Otherwise: Respond with your natural consultant persona.
    """


    # tools required
    result = agent.invoke({
        "messages": [SystemMessage(content=prompt)] + state["messages"][-5:]
    })

    final_msg = result["messages"][-1]
    content = final_msg.content
    print(content)


    # Normal response
    

    if "FINALIZE" in content.upper():
        
        return {
            "messages": [AIMessage(content="Great! Preparing your itinerary… ✈️")],
            "stage": "finalize"
        }
    

    return {
        "messages": [content],
        "stage": "active"
    }
    


# NODE 4 — FINAL ITINERARY

def generate_itinerary(state: TravelState):

    prompt = f"""
    Create a premium, detailed travel itinerary.

    Use these exact ISO dates:
    Departure: {state['departure_date']}
    Return: {state['return_date']}

    current_location: {state['current_location']}
    Destination: {state['destination']}
    Budget: {state['budget']}
    Travelers: {state['travelers']}

    Do NOT reinterpret dates.
    Make it high quality, practical, and personalized.
    """
    
    print("itinerary")
    response = agent.invoke([SystemMessage(content=prompt)])


    return {
        "itinerary": response.content,
        "messages":  [response]
    }

# ROUTER

def router(state: TravelState):
    if state.get("stage") == "finalize":
        return "final"
    return END

# BUILD GRAPH

graph = StateGraph(TravelState)

graph.add_node("extract", extract)
graph.add_node("validate", validate_logic)
graph.add_node("brain", thinking_brain)
graph.add_node("final", generate_itinerary)

graph.add_edge(START, "extract")
graph.add_edge("extract", "validate")
graph.add_edge("validate", "brain")

graph.add_conditional_edges(
    "brain",
    router,
    {
        "final": "final",
        END: END
    }
)

graph.add_edge("final", END)

workflow = graph.compile(checkpointer=MemorySaver())
