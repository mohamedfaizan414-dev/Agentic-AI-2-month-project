from sqlalchemy import Column, String, Text, Date, Integer, Numeric, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from database import Base

# Note: We use a String fallback for UUID if not using PostgreSQL
# to make the app more portable (e.g., SQLite testing).

class Conversation(Base):
    __tablename__ = "conversations"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    started_at = Column(DateTime(timezone=True), server_default=func.now())

class Message(Base):
    __tablename__ = "messages"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    conversation_id = Column(String, ForeignKey("conversations.id"))
    role = Column(String)
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class TravelContext(Base):
    __tablename__ = "travel_context"
    conversation_id = Column(String, ForeignKey("conversations.id"), primary_key=True)
    destination = Column(String)
    departure_date = Column(Date)
    return_date = Column(Date)
    budget = Column(Numeric)
    travelers = Column(Integer)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())