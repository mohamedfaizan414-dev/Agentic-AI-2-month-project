# main.py

from fastapi import FastAPI
from api import router

app = FastAPI(
    title="Travel Agent AI",
    version="1.0.0"
)

app.include_router(router)

@app.get("/")
def health():
    return {"status": "Travel Agent API running"}