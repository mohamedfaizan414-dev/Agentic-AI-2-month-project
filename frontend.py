import streamlit as st
from langchain_core.messages import HumanMessage
from crud import create_conversation, save_message, load_messages
from graph import workflow   # your compiled LangGraph workflow


# PAGE CONFIG

st.set_page_config(page_title="Travel AI Agent", page_icon="✈️")

st.title("✈️ AI Travel Planner")

# SESSION INITIALIZATION



if "conversation_id" not in st.session_state:
    st.session_state.conversation_id = create_conversation()

conversation_id = st.session_state.conversation_id

# LOAD MESSAGE HISTORY FROM DATABASE


messages = load_messages(conversation_id)

# Display previous messages
for msg in messages:
    if msg.type == "human":
        with st.chat_message("user"):
            st.markdown(msg.content)
    else:
        with st.chat_message("assistant"):
            st.markdown(msg.content)

# CHAT INPUT

user_input = st.chat_input("Plan your next adventure...")

if user_input:

    # 1️⃣ Display user message immediately
    with st.chat_message("user"):
        st.markdown(user_input)

    # 2️⃣ Save user message to DB
    save_message(conversation_id, "user", user_input)

    # 3️⃣ Load updated history from DB
    history = load_messages(conversation_id)

    # 4️⃣ Prepare state for LangGraph
    state = {
        "messages": history
    }

    # 5️⃣ Run LangGraph workflow
    result = workflow.invoke(
    state,
    config={
        "configurable": {
            "thread_id": str(conversation_id)
        }
    }
)


    assistant_reply = result["messages"][-1].content

    # 6️⃣ Display assistant reply
    with st.chat_message("assistant"):
        st.markdown(assistant_reply)

    # 7️⃣ Save assistant reply to DB
    save_message(conversation_id, "assistant", assistant_reply)
