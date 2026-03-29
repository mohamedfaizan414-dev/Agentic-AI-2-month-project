# app/api.py
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from langchain_core.messages import HumanMessage
from models import ChatRequest, ChatResponse
from graph import workflow
import json, time

router = APIRouter(prefix="/chat", tags=["Chat"])


def _build_initial_state(request: ChatRequest) -> dict:
    return {
        "messages":        [HumanMessage(content=request.message)],
        "conversation_id": request.conversation_id,
        "travel_data":     {},
        "current_location": None,
        "destination":      None,
        "departure_date":   None,
        "return_date":      None,
        "budget":           None,
        "budget_currency":  "INR",
        "travelers":        None,
        "trip_purpose":     None,
        "validation_issue": None,
        "stage":            "active",
        "itinerary":        None,
        "packing_list":     None,
        "visa_info":        None,
    }


@router.post("/", response_model=ChatResponse)
def chat(request: ChatRequest):
    """Standard synchronous chat endpoint."""
    try:
        state = _build_initial_state(request)
        result = workflow.invoke(
            state,
            config={"configurable": {"thread_id": request.conversation_id}}
        )
        last_message = result["messages"][-1].content
        return ChatResponse(
            reply=last_message,
            stage=result.get("stage"),
            itinerary=result.get("itinerary"),
            destination=result.get("destination"),
            departure_date=result.get("departure_date"),
            return_date=result.get("return_date"),
            budget=result.get("budget"),
            travelers=result.get("travelers"),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
def health():
    return {"status": "ok", "timestamp": int(time.time())}