from database import SessionLocal
from models import Conversation, Message, TravelContext
from langchain_core.messages import HumanMessage, AIMessage

def create_conversation():
    db = SessionLocal()
    try:
        conv = Conversation()
        db.add(conv)
        db.commit()
        db.refresh(conv)
        return str(conv.id)
    finally:
        db.close()

def save_message(conversation_id, role, content):
    db = SessionLocal()
    try:
        msg = Message(
            conversation_id=conversation_id,
            role=role,
            content=content
        )
        db.add(msg)
        db.commit()
    finally:
        db.close()

def load_messages(conversation_id):
    db = SessionLocal()
    try:
        messages = db.query(Message)\
            .filter(Message.conversation_id == conversation_id)\
            .order_by(Message.created_at)\
            .all()
        
        converted = []
        for m in messages:
            if m.role == "user":
                converted.append(HumanMessage(content=m.content))
            else:
                converted.append(AIMessage(content=m.content))
        return converted
    finally:
        db.close()