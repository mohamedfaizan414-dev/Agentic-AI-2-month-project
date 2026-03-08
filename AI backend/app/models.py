# app/models.py

from pydantic import BaseModel
from typing import Optional, Dict

class ChatRequest(BaseModel):
    conversation_id: str
    message: str

class ChatResponse(BaseModel):
    reply: str
    stage: Optional[str]
    itinerary: Optional[str]