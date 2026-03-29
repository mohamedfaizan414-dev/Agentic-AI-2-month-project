# app/models.py
from pydantic import BaseModel
from typing import Optional


class ChatRequest(BaseModel):
    conversation_id: str
    message: str


class ChatResponse(BaseModel):
    reply: str
    stage: Optional[str] = None
    itinerary: Optional[str] = None
    destination: Optional[str] = None
    departure_date: Optional[str] = None
    return_date: Optional[str] = None
    budget: Optional[float] = None
    travelers: Optional[int] = None