import os
import re
import json
import requests
from typing import TypedDict, List, Optional, Annotated
from datetime import datetime, timedelta

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
from langgraph.prebuilt import create_react_agent

load_dotenv()

# ─────────────────────────────────────────────
# LLM SETUP
# ─────────────────────────────────────────────

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0,
)

AGENT_SYSTEM_PROMPT = """You are ARIA — an elite, hyper-personalized AI travel concierge with 20+ years of expertise.

Your personality: warm, knowledgeable, concise. You anticipate what travellers need before they ask.

CORE BEHAVIOUR:
- Always gather: origin, destination, dates, budget, number of travellers, trip purpose (leisure/business/adventure)
- Use tools proactively to fetch live data — never guess prices, weather, or availability
- When you have enough info, propose a plan and ask for approval before generating the full itinerary
- Format all monetary values with currency symbols
- Use markdown with headers, tables, and bullet points for clarity
- If a validation issue exists, address it first with empathy, then correct it

TOOL USAGE RULES:
- Use weather_tool for destination weather before suggesting seasonal activities
- Use search_hotels_serp when asked about accommodation
- Use check_train_availability when rail travel is feasible
- Use search_flights when the destination requires flying or the user asks about flights  
- Use get_points_of_interest for attraction recommendations
- Use generate_packing_list when the itinerary is ready or when asked
- Use get_visa_requirements before finalizing any international plan
- Use get_travel_news for any safety or entry advisories
- Use currency_exchanger when budget is in a different currency than destination

FINALIZATION:
When the user explicitly approves a plan, or says "yes", "looks good", "go ahead", "book it", respond ONLY with: FINALIZE"""

# ─────────────────────────────────────────────
# STATE
# ─────────────────────────────────────────────

class TravelState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    conversation_id: str
    travel_data: dict
    current_location: Optional[str]
    destination: Optional[str]
    departure_date: Optional[str]
    return_date: Optional[str]
    budget: Optional[float]
    budget_currency: Optional[str]
    travelers: Optional[int]
    trip_purpose: Optional[str]
    validation_issue: Optional[dict]
    stage: Optional[str]
    itinerary: Optional[str]
    packing_list: Optional[str]
    visa_info: Optional[str]

# ─────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────

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


def fmt_date_for_api(date_str: Optional[str]) -> Optional[str]:
    """Convert ISO date string to YYYY-MM-DD."""
    if not date_str:
        return None
    try:
        return datetime.fromisoformat(date_str).strftime("%Y-%m-%d")
    except Exception:
        return date_str

# ─────────────────────────────────────────────
# TOOLS
# ─────────────────────────────────────────────

_search = DuckDuckGoSearchRun()


@tool
def search_tool(query: str) -> str:
    """Search the web for prices, places, events, visa info, or anything uncertain."""
    result = _search.invoke(query)
    print("[tool] search_tool used")
    return result


@tool
def check_train_availability(source: str, destination: str, date: str) -> str:
    """
    Check train availability between two stations on a specific date.
    Use station codes (e.g., 'NDLS' for Delhi) and date in DD-MM-YYYY format.
    Returns train names, timings, classes, and availability status.
    """
    url = os.getenv("RapidAPI_url")
    headers = {
        "x-rapidapi-host": os.getenv("RapidAPI_host"),
        "x-rapidapi-key":  os.getenv("RapidAPI_key"),
    }
    params = {"source": source, "destination": destination, "date": date}
    print("[tool] check_train_availability used")
    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        # Extract the most useful fields for the agent
        trains = data.get("data", {}).get("trains", [])
        if not trains:
            return f"No trains found from {source} to {destination} on {date}."
        lines = [f"Trains from {source} → {destination} on {date}:"]
        for t in trains[:5]:
            name = t.get("train_name", "Unknown")
            number = t.get("train_number", "")
            dep = t.get("from_time", "")
            arr = t.get("to_time", "")
            dur = t.get("duration", "")
            classes = ", ".join(t.get("class_type", []))
            lines.append(f"• {name} ({number}) | Dep: {dep} | Arr: {arr} | Duration: {dur} | Classes: {classes}")
        return "\n".join(lines)
    except Exception as e:
        return f"Error fetching train data: {str(e)}"


@tool
def currency_exchanger(base_amount: float, base_currency: str, target_currency: str) -> str:
    """Convert an amount from one currency to another using live exchange rates.
    Use ISO currency codes (USD, INR, EUR, GBP, JPY, etc.)."""
    url = (
        f"https://v6.exchangerate-api.com/v6/{os.getenv('EXCHANGE_RATE_API_KEY')}"
        f"/pair/{base_currency}/{target_currency}"
    )
    print("[tool] currency_exchanger used")
    try:
        data = requests.get(url, timeout=10).json()
        if data.get("result") != "success":
            return f"Currency conversion failed: {data.get('error-type', 'unknown error')}"
        rate = data["conversion_rate"]
        converted = base_amount * rate
        return (
            f"{base_amount:,.2f} {base_currency} = {converted:,.2f} {target_currency} "
            f"(rate: 1 {base_currency} = {rate} {target_currency})"
        )
    except Exception as e:
        return f"Currency conversion error: {str(e)}"


@tool
def weather_tool(location: str) -> str:
    """
    Fetch current live weather AND a 7-day forecast for a city.
    Use city name (e.g., 'Paris' or 'New Delhi').
    Returns temperature, conditions, humidity, wind, and travel suitability.
    """
    url = (
        f"http://api.weatherstack.com/current"
        f"?access_key={os.getenv('WEATHER_API_KEY')}&query={location}&forecast=7"
    )
    print("[tool] weather_tool used")
    try:
        response = requests.get(url, timeout=10).json()
        if "error" in response:
            return f"Weather error: {response['error'].get('info', 'Unknown error')}"
        loc_name = response["location"]["name"]
        country = response["location"]["country"]
        temp = response["current"]["temperature"]
        desc = response["current"]["weather_descriptions"][0]
        feels = response["current"]["feelslike"]
        humid = response["current"]["humidity"]
        wind = response["current"]["wind_speed"]
        uv = response["current"].get("uv_index", "N/A")
        visibility = response["current"].get("visibility", "N/A")
        
        # Travel suitability assessment
        if temp > 35:
            suitability = "Very hot — recommend light clothing, sunscreen, and indoor activities midday."
        elif temp > 25:
            suitability = "Warm and pleasant — ideal for outdoor activities."
        elif temp > 15:
            suitability = "Mild — a light jacket recommended."
        elif temp > 5:
            suitability = "Cool — warm layers needed."
        else:
            suitability = "Cold — heavy winter clothing essential."

        return (
            f"Weather in {loc_name}, {country}: {desc}\n"
            f"Temperature: {temp}°C (feels like {feels}°C)\n"
            f"Humidity: {humid}% | Wind: {wind} km/h | UV Index: {uv} | Visibility: {visibility} km\n"
            f"Travel tip: {suitability}"
        )
    except Exception as e:
        return f"Weather fetch error: {str(e)}"


@tool
def search_hotels_serp(destination: str, check_in: str, check_out: str, max_price: Optional[float] = None) -> str:
    """
    Search for real-time hotel listings with prices.
    - destination: city name (e.g., 'Goa' or 'London')
    - check_in / check_out: YYYY-MM-DD format
    - max_price: optional budget cap per night in INR
    Returns top hotels with name, price per night, rating, and amenities.
    """
    print("[tool] search_hotels_serp used")
    try:
        client = serpapi.Client(api_key=os.getenv("SERPAPI_KEY"))
        params = {
            "engine": "google_hotels",
            "q": destination,
            "check_in_date": check_in,
            "check_out_date": check_out,
            "currency": "INR",
            "gl": "in",
            "hl": "en",
        }
        if max_price:
            params["max_price"] = int(max_price)
        
        results = client.search(params)
        hotels = results.get("properties", [])
        if not hotels:
            return f"No hotels found for {destination} from {check_in} to {check_out}."
        lines = [f"Hotels in {destination} ({check_in} → {check_out}):"]
        for h in hotels[:5]:
            name = h.get("name", "Unknown Hotel")
            price = h.get("rate_per_night", {}).get("lowest", "N/A")
            rating = h.get("overall_rating", "N/A")
            reviews = h.get("reviews", "")
            amenities = ", ".join(h.get("amenities", [])[:4])
            hotel_class = h.get("hotel_class", "")
            lines.append(
                f"\n🏨 {name} {hotel_class}\n"
                f"   Price: ₹{price}/night | Rating: {rating}/5 ({reviews} reviews)\n"
                f"   Amenities: {amenities or 'N/A'}"
            )
        return "\n".join(lines)
    except Exception as e:
        return f"Hotel search error: {str(e)}"


@tool
def search_flights(origin: str, destination: str, date: str, return_date: Optional[str] = None, passengers: int = 1) -> str:
    """
    Search for available flights between two cities.
    - origin / destination: city or IATA airport code (e.g., 'DEL' or 'New Delhi')
    - date: departure date in YYYY-MM-DD format
    - return_date: optional, for round trips
    - passengers: number of adult passengers
    Returns airline names, prices, duration, and stops.
    """
    print("[tool] search_flights used")
    try:
        client = serpapi.Client(api_key=os.getenv("SERPAPI_KEY"))
        params = {
            "engine": "google_flights",
            "departure_id": origin,
            "arrival_id": destination,
            "outbound_date": date,
            "currency": "INR",
            "hl": "en",
            "adults": passengers,
            "type": "2" if return_date else "2",  # 1=round, 2=one-way
        }
        if return_date:
            params["return_date"] = return_date
            params["type"] = "1"
        
        results = client.search(params)
        best = results.get("best_flights", []) or results.get("other_flights", [])
        if not best:
            return f"No flights found from {origin} to {destination} on {date}."
        
        lines = [f"Flights from {origin} → {destination} on {date}:"]
        for f_opt in best[:4]:
            flights = f_opt.get("flights", [{}])
            airline = flights[0].get("airline", "Unknown")
            price = f_opt.get("price", "N/A")
            duration = f_opt.get("total_duration", "N/A")
            stops = len(flights) - 1
            stop_label = "Non-stop" if stops == 0 else f"{stops} stop(s)"
            dep_time = flights[0].get("departure_airport", {}).get("time", "")
            arr_time = flights[-1].get("arrival_airport", {}).get("time", "")
            lines.append(
                f"\n✈️ {airline} | ₹{price:,} | {stop_label} | {duration} min\n"
                f"   Departs: {dep_time} → Arrives: {arr_time}"
            )
        return "\n".join(lines)
    except Exception as e:
        return f"Flight search error: {str(e)}"


@tool
def get_points_of_interest(destination: str, category: str = "all", budget_level: str = "mid-range") -> str:
    """
    Find top points of interest, attractions, restaurants, and experiences.
    - destination: city name
    - category: 'attractions', 'restaurants', 'nature', 'culture', 'nightlife', or 'all'
    - budget_level: 'budget', 'mid-range', or 'luxury'
    Returns a curated list with descriptions and tips.
    """
    print("[tool] get_points_of_interest used")
    query = f"top {category} things to do in {destination} {budget_level} travel 2024"
    result = _search.invoke(query)
    return f"Points of Interest in {destination} ({category}, {budget_level}):\n{result}"


@tool
def generate_packing_list(destination: str, duration_days: int, climate: str, activities: str) -> str:
    """
    Generate a smart, context-aware packing list.
    - destination: city/country name
    - duration_days: length of trip
    - climate: 'tropical', 'cold', 'temperate', 'desert', 'rainy'
    - activities: comma-separated list (e.g., 'hiking, beach, business meetings, sightseeing')
    """
    print("[tool] generate_packing_list used")
    
    essentials = [
        "Passport & travel documents", "Visa (if required)", "Travel insurance documents",
        "Credit/debit cards & cash", "Phone + charger", "Power bank", "Universal adapter"
    ]
    
    clothing_map = {
        "tropical": ["Light breathable shirts (×{d})", "Shorts / light trousers", "Swimwear",
                     "Sandals", "Rain jacket (tropical showers)", "Sun hat"],
        "cold": ["Thermal base layers", "Heavy winter jacket", "Warm sweaters (×{d})",
                 "Insulated boots", "Gloves & scarf", "Woollen socks", "Beanie"],
        "temperate": ["T-shirts (×{d})", "Light jacket", "Jeans/trousers",
                      "Comfortable walking shoes", "Cardigan/sweater"],
        "desert": ["Loose cotton shirts (×{d})", "Sun hat (wide brim)", "Sunglasses (UV400)",
                   "Light trousers (full coverage)", "Comfortable closed shoes", "Lip balm"],
        "rainy": ["Waterproof jacket", "Quick-dry clothing", "Waterproof boots",
                  "Compact umbrella", "Dry bags for electronics"],
    }
    
    activity_map = {
        "hiking": ["Trekking shoes", "Trekking poles", "Moisture-wicking socks", "Blister kit"],
        "beach": ["Sunscreen SPF 50+", "After-sun lotion", "Beach towel", "Snorkelling gear"],
        "business": ["Formal attire", "Laptop + cables", "Business cards", "Portfolio/folder"],
        "sightseeing": ["Comfortable walking shoes", "Day backpack", "Water bottle", "City maps"],
        "nightlife": ["Smart casual outfit", "Evening shoes"],
        "adventure": ["First aid kit", "Energy bars", "Headlamp", "Multi-tool"],
    }
    
    clothing = clothing_map.get(climate.lower(), clothing_map["temperate"])
    clothing = [c.format(d=min(duration_days, 5)) for c in clothing]
    
    extras = []
    for act in activities.split(","):
        act = act.strip().lower()
        for key in activity_map:
            if key in act:
                extras.extend(activity_map[key])
    extras = list(dict.fromkeys(extras))  # deduplicate
    
    health = [
        "Personal medications", "Basic first aid kit", "Hand sanitizer",
        "Insect repellent (if tropical)", "Sunscreen SPF 50+", "Rehydration sachets"
    ]
    
    result = f"🧳 Packing List for {destination} ({duration_days} days, {climate} climate)\n\n"
    result += "📋 Essentials:\n" + "\n".join(f"  • {e}" for e in essentials)
    result += f"\n\n👕 Clothing ({climate}):\n" + "\n".join(f"  • {c}" for c in clothing)
    if extras:
        result += f"\n\n🎯 Activity-Specific ({activities}):\n" + "\n".join(f"  • {e}" for e in extras)
    result += "\n\n💊 Health & Safety:\n" + "\n".join(f"  • {h}" for h in health)
    result += f"\n\n💡 Tip: Pack {max(1, duration_days // 3)} fewer clothing items than you think — you'll buy things!"
    return result


@tool
def get_visa_requirements(passport_country: str, destination_country: str) -> str:
    """
    Check visa requirements for a specific passport holder travelling to a destination.
    - passport_country: country of the traveller's passport (e.g., 'India', 'USA')
    - destination_country: the country they plan to visit
    Returns visa type, processing time, fees, and key requirements.
    """
    print("[tool] get_visa_requirements used")
    query = f"visa requirements for {passport_country} passport holders visiting {destination_country} 2024"
    result = _search.invoke(query)
    return f"Visa info ({passport_country} → {destination_country}):\n{result}"


@tool
def get_travel_news(destination: str) -> str:
    """
    Fetch latest travel advisories, safety alerts, entry requirements, and news for a destination.
    Always call this before finalizing any international itinerary.
    """
    print("[tool] get_travel_news used")
    query = f"{destination} travel advisory safety news 2024 tourist entry requirements"
    result = _search.invoke(query)
    return f"Latest travel news for {destination}:\n{result}"


# ─────────────────────────────────────────────
# AGENT
# ─────────────────────────────────────────────

tools = [
    search_tool,
    currency_exchanger,
    check_train_availability,
    weather_tool,
    search_hotels_serp,
    search_flights,
    get_points_of_interest,
    generate_packing_list,
    get_visa_requirements,
    get_travel_news,
]

agent = create_react_agent(
    model=llm,
    tools=tools,
    prompt=AGENT_SYSTEM_PROMPT,
)

# ─────────────────────────────────────────────
# NODE 1 — EXTRACT
# ─────────────────────────────────────────────

def extract(state: TravelState) -> dict:
    today = datetime.today().date()
    last_messages = state["messages"][-8:]  # use more context
    
    prompt_text = f"""
Today's date is: {today}

Extract ALL travel details from the conversation below.
Infer values where clearly implied (e.g. "next Friday" → compute the exact date).
Return ONLY valid JSON, no extra text or markdown:
{{
  "current_location": string or null,
  "destination": string or null,
  "departure_date": string or null,
  "return_date": string or null,
  "budget": number or null,
  "budget_currency": string or null (e.g. "INR", "USD", "EUR"),
  "travelers": number or null,
  "trip_purpose": string or null (e.g. "leisure", "business", "honeymoon", "family")
}}

Conversation:
{[m.content for m in last_messages if hasattr(m, 'content')]}
"""
    response = llm.invoke(prompt_text)
    data = safe_json_extract(response.content)

    return {
        "current_location": data.get("current_location") or state.get("current_location"),
        "destination":      data.get("destination")      or state.get("destination"),
        "departure_date":   data.get("departure_date")   or state.get("departure_date"),
        "return_date":      data.get("return_date")      or state.get("return_date"),
        "budget":           data.get("budget")           or state.get("budget"),
        "budget_currency":  data.get("budget_currency")  or state.get("budget_currency") or "INR",
        "travelers":        data.get("travelers")        or state.get("travelers"),
        "trip_purpose":     data.get("trip_purpose")     or state.get("trip_purpose"),
    }

# ─────────────────────────────────────────────
# NODE 2 — VALIDATE
# ─────────────────────────────────────────────

def validate_logic(state: TravelState) -> dict:
    dep_raw  = state.get("departure_date")
    ret_raw  = state.get("return_date")
    budget   = state.get("budget")
    travelers = state.get("travelers")
    today    = datetime.today().date()

    issues = []

    if dep_raw:
        dep_date, dep_error = resolve_date(dep_raw)
        if dep_error:
            return {"validation_issue": {"type": "DATE_ERROR", "field": "departure_date", "reason": dep_error}}
        if dep_date < today:
            return {"validation_issue": {
                "type": "DATE_IN_PAST",
                "field": "departure_date",
                "given": dep_date.isoformat(),
                "today": today.isoformat(),
            }}

        if ret_raw:
            ret_date, ret_error = resolve_date(ret_raw)
            if ret_error:
                return {"validation_issue": {"type": "DATE_ERROR", "field": "return_date", "reason": ret_error}}
            if ret_date <= dep_date:
                return {"validation_issue": {
                    "type": "DATE_LOGIC_ERROR",
                    "reason": "RETURN_BEFORE_DEPARTURE",
                    "departure": dep_date.isoformat(),
                    "return": ret_date.isoformat(),
                }}
            # Both dates are valid
            return {
                "validation_issue": None,
                "departure_date": dep_date.isoformat(),
                "return_date":    ret_date.isoformat(),
            }
        
        return {
            "validation_issue": None,
            "departure_date": dep_date.isoformat(),
        }

    if budget is not None:
        if budget <= 0:
            return {"validation_issue": {"type": "BUDGET_TOO_LOW", "budget": budget, "reason": "Budget must be positive."}}
        if travelers and travelers > 1 and (budget / travelers) < 500:
            return {"validation_issue": {
                "type": "BUDGET_PER_PERSON_TOO_LOW",
                "budget": budget,
                "travelers": travelers,
                "per_person": round(budget / travelers),
            }}

    return {"validation_issue": None}

# ─────────────────────────────────────────────
# NODE 3 — THINKING BRAIN
# ─────────────────────────────────────────────

def thinking_brain(state: TravelState) -> dict:
    validation_issue = state.get("validation_issue")
    today = datetime.today().date()

    dep = state.get("departure_date")
    ret = state.get("return_date")
    trip_days = None
    if dep and ret:
        try:
            trip_days = (datetime.fromisoformat(ret) - datetime.fromisoformat(dep)).days
        except Exception:
            pass

    system_prompt = f"""
### ROLE
You are ARIA, an elite AI travel concierge. Today is {today}.

### CURRENT TRIP CONTEXT
- From            : {state.get("current_location") or "Not specified"}
- To              : {state.get("destination") or "Not specified"}
- Departure       : {state.get("departure_date") or "Not specified"}
- Return          : {state.get("return_date") or "Not specified"}
- Duration        : {f"{trip_days} days" if trip_days else "Not calculated"}
- Budget          : {state.get("budget") or "Not specified"} {state.get("budget_currency") or ""}
- Travellers      : {state.get("travelers") or "Not specified"}
- Trip Purpose    : {state.get("trip_purpose") or "Not specified"}

### VALIDATION ISSUES
{json.dumps(validation_issue, indent=2) if validation_issue else "None — all inputs are valid."}

### INSTRUCTIONS
1. If validation issues exist → address them warmly and ask for corrected info.
2. If critical info is missing (destination, dates) → ask naturally, one question at a time.
3. If info is sufficient → use tools proactively (weather, hotels, flights, visa, POI) without being asked.
4. After gathering data → propose a high-level trip overview (transport, stay, highlights, budget estimate).
5. Once the user approves → respond ONLY with the single word: FINALIZE
6. Always respond in rich markdown with headers, bullet points, and tables where appropriate.
7. End responses with a clear next-step prompt or question.
"""

    result = agent.invoke({
        "messages": [SystemMessage(content=system_prompt)] + list(state["messages"][-10:])
    })

    final_msg = result["messages"][-1]
    content   = final_msg.content if hasattr(final_msg, "content") else str(final_msg)

    if "FINALIZE" in content.upper().strip():
        return {
            "messages": [AIMessage(content="✈️ Perfect! I'm crafting your personalised itinerary now — this may take a moment…")],
            "stage": "finalize",
        }

    return {
        "messages": [AIMessage(content=content)],
        "stage": "active",
    }

# ─────────────────────────────────────────────
# NODE 4 — GENERATE ITINERARY
# ─────────────────────────────────────────────

def generate_itinerary(state: TravelState) -> dict:
    dep = state.get("departure_date")
    ret = state.get("return_date")
    trip_days = 0
    if dep and ret:
        try:
            trip_days = (datetime.fromisoformat(ret) - datetime.fromisoformat(dep)).days
        except Exception:
            pass

    prompt_text = f"""
Create a PREMIUM, detailed, day-by-day travel itinerary. This is the final deliverable.

TRIP DETAILS (use EXACTLY these dates — do NOT reinterpret):
  From            : {state.get("current_location")}
  To              : {state.get("destination")}
  Departure       : {state.get("departure_date")} (Day 1)
  Return          : {state.get("return_date")} (Day {trip_days + 1})
  Duration        : {trip_days} nights
  Budget          : {state.get("budget")} {state.get("budget_currency", "INR")}
  Travellers      : {state.get("travelers")}
  Purpose         : {state.get("trip_purpose", "leisure")}

REQUIRED SECTIONS (use these exact headers):

## ✈️ Trip Overview
- Brief summary of the trip (2-3 sentences)

## 🚀 Getting There
- Best transport option (flight/train/car) with estimated cost
- Booking tips and best time to book

## 📅 Day-by-Day Itinerary
For EACH day, include:
- Morning, Afternoon, Evening plan with specific activity names
- Meal recommendations (breakfast/lunch/dinner spots with price range)
- Estimated daily spend breakdown

## 🏨 Accommodation Recommendations
- 3 options across budget tiers (budget / mid-range / luxury)
- Location, price range, and why it's recommended

## 💰 Budget Breakdown
A markdown table with categories (transport, stay, food, activities, miscellaneous, contingency)

## 🎒 Packing Essentials
Top 10 must-pack items for this specific trip

## ⚠️ Important Notes
- Visa requirements
- Local customs and etiquette
- Best apps to download
- Emergency contacts format

## 💡 Pro Tips
3-5 insider tips specific to this destination and travel style

Make it genuinely world-class — specific, practical, and personalized. Include real place names, real dishes, real neighbourhoods.
"""
    print("[node] generate_itinerary")

    result = agent.invoke({
        "messages": [HumanMessage(content=prompt_text)]
    })

    final_msg = result["messages"][-1]
    content   = final_msg.content if hasattr(final_msg, "content") else str(final_msg)

    return {
        "itinerary": content,
        "messages":  [AIMessage(content=content)],
        "stage": "done",
    }

# ─────────────────────────────────────────────
# ROUTER
# ─────────────────────────────────────────────

def router(state: TravelState) -> str:
    if state.get("stage") == "finalize":
        return "final"
    return END

# ─────────────────────────────────────────────
# BUILD GRAPH
# ─────────────────────────────────────────────

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