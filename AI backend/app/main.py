# ─────────────────────────────────────────────
# main.py
# ─────────────────────────────────────────────
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import router

app = FastAPI(
    title="TravelAI Agent API",
    version="2.0.0",
    description="Elite AI travel concierge — LangGraph + Groq",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def root():
    return {"status": "TravelAI Agent API v2.0 running", "docs": "/docs"}


