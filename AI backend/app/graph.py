import os
import re
import json
import requests
from typing import TypedDict, List, Optional, Annotated
from datetime import datetime

import dateparser
import serpapi
from dotenv import load_dotenv

from langchain_groq import ChatGroq
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_core.tools import tool
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage

from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent   # ✅ FIX 1: correct import

load_dotenv()

# LLM SETUP

llm = ChatGroq(
    model="llama-3.3-70b-versatile",   # ✅ FIX 2: valid Groq model
    temperature=0,
)

# ✅ FIX 3: removed broken client.pull_prompt — define system prompt directly
AGENT_SYSTEM_PROMPT = """You are a premium, intelligent travel consultant AI.
Your job is to help users plan trips by gathering details, answering questions,
and calling tools when you need real-time data (prices, weather, hotels, trains).
Always be helpful, friendly, and precise."""

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

# HELPERS

def safe_json_extract(text: str) -> dict:
    try:
        match = re.search(r"\{[\s\S]*?\}", text)
        if match:
            return json.loads(match.group())
    except Exception:
        pass
    return {}


def resolve_date(date_str: Optional[str]):
    if not date_str:
        return None, "MISSING_DATE"
    parsed = dateparser.parse(date_str, settings={"PREFER_DATES_FROM": "future"})
    if not parsed:
        return None, "INVALID_FORMAT"
    return parsed.date(), None

# TOOLS

_search = DuckDuckGoSearchRun()

@tool
def search_tool(query: str) -> str:
    """Search the web for prices, places, events, or anything uncertain."""
    result = _search.invoke(query)
    print("[tool] search_tool used")
    return result


@tool
def check_train_availability(source: str, destination: str, date: str) -> str:
    """
    Check train availability between two stations on a specific date.
    Use station codes (e.g., 'NDLS' for Delhi) and date in DD-MM-YYYY format.
    """
    url = os.getenv("RapidAPI_url")
    headers = {
        "x-rapidapi-host": os.getenv("RapidAPI_host"),
        "x-rapidapi-key":  os.getenv("RapidAPI_key"),
    }
    params = {"source": source, "destination": destination, "date": date}
    print("[tool] check_train_availability used")
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return str(response.json())
    except Exception as e:
        return f"Error fetching train data: {str(e)}"


@tool
def currency_exchanger(base_amount: float, base_currency: str, target_currency: str) -> str:
    """Convert an amount from one currency to another using live exchange rates."""
    url = (
        f"https://v6.exchangerate-api.com/v6/{os.getenv('EXCHANGE_RATE_API_KEY')}"
        f"/pair/{base_currency}/{target_currency}"
    )
    print("[tool] currency_exchanger used")
    try:
        data = requests.get(url).json()
        rate = data["conversion_rate"]
        converted = base_amount * rate
        return f"{base_amount} {base_currency} = {converted:.2f} {target_currency} (rate: {rate})"
    except Exception as e:
        return f"Currency conversion error: {str(e)}"


@tool
def weather_tool(location: str) -> str:
    """
    Fetch current live weather for a city (e.g., 'London' or 'New York').
    """
    url = (
        f"http://api.weatherstack.com/current"
        f"?access_key={os.getenv('WEATHER_API_KEY')}&query={location}"
    )
    print("[tool] weather_tool used")
    try:
        response = requests.get(url).json()
        loc_name = response["location"]["name"]
        temp     = response["current"]["temperature"]
        desc     = response["current"]["weather_descriptions"][0]
        feels    = response["current"]["feelslike"]
        humid    = response["current"]["humidity"]
        wind     = response["current"]["wind_speed"]
        return (
            f"Live weather for {loc_name}: {desc}, {temp}°C "
            f"(feels like {feels}°C). Humidity: {humid}%, Wind: {wind} km/h."
        )
    except Exception as e:
        return f"Weather fetch error: {str(e)}"


@tool
def search_hotels_serp(destination: str, check_in: str, check_out: str) -> str:
    """
    Search for real-time hotel data.
    - destination: city name (e.g., 'Thrissur')
    - check_in / check_out : dates in DD-MM-YYYY format
        if any parameter is missing,
        ask the user for it instead of calling the tool, e.g. "Please provide check-in and check-out dates to search for hotels in Thrissur."
    """
    print("[tool] search_hotels_serp used")
    try:
        client = serpapi.Client(api_key=os.getenv("SERPAPI_KEY"))
        results = client.search({
            "engine": "google_hotels",
            "q": destination,
            "check_in_date": check_in,
            "check_out_date": check_out,
            "currency": "INR",
            "gl": "in",
        })
        hotels = results.get("properties", [])
        if not hotels:
            return f"No hotels found for {destination} from {check_in} to {check_out}."
       
        return json.dumps(hotels[:5], indent=2)  
    
    except Exception as e:
        return f"Hotel search error: {str(e)}"

# AGENT

tools = [search_tool, currency_exchanger, check_train_availability, weather_tool, search_hotels_serp]

# ✅ FIX 4: use create_react_agent correctly with prompt kwarg
agent = create_react_agent(
    model=llm,
    tools=tools,
    prompt=AGENT_SYSTEM_PROMPT,
)

# NODE 1 — EXTRACT

def extract(state: TravelState) -> dict:
    today = datetime.today().date()
    prompt_text = f"""
Today's date is: {today}

Extract travel details from the conversation below.
Return ONLY valid JSON — no extra text:
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
    response = llm.invoke(prompt_text)
    data = safe_json_extract(response.content)

    return {
        "current_location": data.get("current_location") or state.get("current_location"),
        "destination":      data.get("destination")      or state.get("destination"),
        "departure_date":   data.get("departure_date")   or state.get("departure_date"),
        "return_date":      data.get("return_date")      or state.get("return_date"),
        "budget":           data.get("budget")           or state.get("budget"),
        "travelers":        data.get("travelers")        or state.get("travelers"),
    }

# NODE 2 — VALIDATE

def validate_logic(state: TravelState) -> dict:
    dep_raw  = state.get("departure_date")
    ret_raw  = state.get("return_date")
    budget   = state.get("budget")
    travelers = state.get("travelers")

    if dep_raw or ret_raw:
        dep_date, dep_error = resolve_date(dep_raw)
        ret_date, ret_error = resolve_date(ret_raw)

        if dep_error:
            return {"validation_issue": {"type": "DATE_ERROR", "field": "departure_date", "reason": dep_error}}
        if ret_error:
            return {"validation_issue": {"type": "DATE_ERROR", "field": "return_date", "reason": ret_error}}
        if ret_date <= dep_date:
            return {"validation_issue": {
                "type": "DATE_LOGIC_ERROR",
                "reason": "RETURN_BEFORE_DEPARTURE",
                "departure": dep_date.isoformat(),
                "return": ret_date.isoformat(),
            }}

        # Dates are valid — store ISO strings back
        return {
            "validation_issue": None,
            "departure_date": dep_date.isoformat(),
            "return_date":    ret_date.isoformat(),
        }

    if budget is not None:
        if budget < 100:
            return {"validation_issue": {"type": "BUDGET_TOO_LOW", "budget": budget}}
        if travelers and (budget / travelers) < 200:
            return {"validation_issue": {
                "type": "BUDGET_PER_PERSON_TOO_LOW",
                "budget": budget,
                "travelers": travelers,
            }}

    return {"validation_issue": None}

# NODE 3 — THINKING BRAIN

def thinking_brain(state: TravelState) -> dict:
    validation_issue = state.get("validation_issue")

    system_prompt = f"""
### ROLE
You are a premium, intelligent travel consultant. Your goal is to gather travel details,
resolve validation errors, and provide expert recommendations.

### CURRENT TRAVEL CONTEXT
- Current Location : {state.get("current_location")}
- Destination      : {state.get("destination")}
- Departure Date   : {state.get("departure_date")}
- Return Date      : {state.get("return_date")}
- Total Budget     : {state.get("budget")}
- Travelers        : {state.get("travelers")}

### ACTIVE VALIDATION ISSUES
{validation_issue if validation_issue else "None"}

### INSTRUCTIONS
1. ADDRESS ERRORS first if a validation issue is present.
2. Use tools (search_tool, weather_tool, etc.) for real-time data.
3. If info is missing, ask for it naturally.
4. If all details are known, propose a high-level travel plan.
5. If the user explicitly asks for the final itinerary OR agrees to the proposed plan,
   respond ONLY with the single word: FINALIZE
"""

    # ✅ FIX 5: pass proper message list; agent returns {"messages": [...]}
    result = agent.invoke({
        "messages": [SystemMessage(content=system_prompt)] + list(state["messages"][-6:])
    })

    final_msg = result["messages"][-1]
    content   = final_msg.content if hasattr(final_msg, "content") else str(final_msg)

    if "FINALIZE" in content.upper():
        return {
            "messages": [AIMessage(content="Great! Preparing your personalised itinerary… ✈️")],
            "stage": "finalize",
        }

    # ✅ FIX 6: always wrap in AIMessage so add_messages reducer is happy
    return {
        "messages": [AIMessage(content=content)],
        "stage": "active",
    }

# NODE 4 — GENERATE ITINERARY

def generate_itinerary(state: TravelState) -> dict:
    prompt_text = f"""
Create a premium, detailed day-by-day travel itinerary.

Use these EXACT ISO dates — do NOT reinterpret them:
  Departure : {state.get("departure_date")}
  Return    : {state.get("return_date")}

From            : {state.get("current_location")}
To              : {state.get("destination")}
Total Budget    : {state.get("budget")}
Number of People: {state.get("travelers")}

Make it high-quality, practical, and personalised. Include transport, accommodation
suggestions, daily activities, food recommendations, and budget breakdown.
"""
    print("[node] generate_itinerary")

    # ✅ FIX 7: agent.invoke expects dict with "messages" key
    result = agent.invoke({
        "messages": [HumanMessage(content=prompt_text)]
    })

    final_msg = result["messages"][-1]
    content   = final_msg.content if hasattr(final_msg, "content") else str(final_msg)

    return {
        "itinerary": content,
        "messages":  [AIMessage(content=content)],
    }



def router(state: TravelState) -> str:
    if state.get("stage") == "finalize":
        return "final"
    return END



graph = StateGraph(TravelState)

graph.add_node("extract",  extract)
graph.add_node("validate", validate_logic)
graph.add_node("brain",    thinking_brain)
graph.add_node("final",    generate_itinerary)

graph.add_edge(START,      "extract")
graph.add_edge("extract",  "validate")
graph.add_edge("validate", "brain")

graph.add_conditional_edges(
    "brain",
    router,
    {"final": "final", END: END},
)

graph.add_edge("final", END)

workflow = graph.compile(checkpointer=MemorySaver())