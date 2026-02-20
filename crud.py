from database import SessionLocal
from models import Conversation, Message,TravelContext
from langchain_core.messages import HumanMessage, AIMessage

def create_conversation():
    db = SessionLocal()
    conv = Conversation()
    db.add(conv)
    db.commit()
    db.refresh(conv)
    db.close()
    return str(conv.id)



def save_travel_context(conversation_id, data):
    db = SessionLocal()

    context = TravelContext(
        conversation_id=conversation_id,
        destination=data.get("destination"),
        start_date=data.get("start_date"),
        end_date=data.get("end_date"),
        budget=data.get("budget"),
        travelers=data.get("travelers"),
       
    )

    db.add(context)
    db.commit()
    db.close()

def save_message(conversation_id, role, content):
    db = SessionLocal()
    msg = Message(
        conversation_id=conversation_id,
        role=role,
        content=content
    )
    db.add(msg)
    db.commit()
    db.close()


def load_messages(conversation_id):
    db = SessionLocal()
    messages = db.query(Message)\
        .filter(Message.conversation_id == conversation_id)\
        .order_by(Message.created_at)\
        .all()

    db.close()

    converted = []

    for m in messages:
        if m.role == "user":
            converted.append(HumanMessage(content=m.content))
        else:
            converted.append(AIMessage(content=m.content))

    return converted
