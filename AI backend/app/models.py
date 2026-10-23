# app/models.py

from pydantic import BaseModel, Field
from typing import Literal, Optional

class ChatTurn(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=4000)

class ChatRequest(BaseModel):
    conversation_id: str = Field(min_length=1, max_length=128)
    message: str = Field(min_length=1, max_length=2000)
    history: list[ChatTurn] = Field(default_factory=list, max_length=12)

class ChatResponse(BaseModel):
    reply: str
    stage: Optional[str]
    itinerary: Optional[str]
