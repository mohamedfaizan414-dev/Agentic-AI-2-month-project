# app/api.py

from fastapi import APIRouter
from langchain_core.messages import AIMessage, HumanMessage
import asyncio
try:
    from .models import ChatRequest, ChatResponse
    from .graph import workflow
except ImportError:
    from models import ChatRequest, ChatResponse
    from graph import workflow

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):

    history = request.history or [
        {"role": "user", "content": request.message}
    ]
    messages = [
        HumanMessage(content=turn.content if hasattr(turn, "content") else turn["content"])
        if (turn.role if hasattr(turn, "role") else turn["role"]) == "user"
        else AIMessage(content=turn.content if hasattr(turn, "content") else turn["content"])
        for turn in history
    ]

    state = {
        "messages": messages,
        "travel_data": {},
        "destination": None,
        "departure_date": None,
        "return_date": None,
        "budget": None,
        "travelers": None,
    }

    result = await asyncio.to_thread(workflow.invoke,
        state,
        config={"configurable": {"thread_id": request.conversation_id}}
    )

    last_message = result["messages"][-1].content

    return ChatResponse(
        reply=last_message,
        stage=result.get("stage"),
        itinerary=result.get("itinerary")
    )
