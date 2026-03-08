# app/api.py

from fastapi import APIRouter
from langchain_core.messages import HumanMessage
from models import ChatRequest, ChatResponse
from graph import workflow   # your compiled graph

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/", response_model=ChatResponse)
def chat(request: ChatRequest):

    state = {
        "messages": [HumanMessage(content=request.message)],
        "conversation_id": request.conversation_id,
        "travel_data": {},
        "destination": None,
        "departure_date": None,
        "return_date": None,
        "budget": None,
        "travelers": None,
        "validation_issue": None,
        "stage": "active",
        "itinerary": None,
    }

    result = workflow.invoke(
        state,
        config={"configurable": {"thread_id": request.conversation_id}}
    )

    last_message = result["messages"][-1].content

    return ChatResponse(
        reply=last_message,
        stage=result.get("stage"),
        itinerary=result.get("itinerary")
    )