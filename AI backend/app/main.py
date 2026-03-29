# main.py

from fastapi import FastAPI
from api import router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(
    title="Travel Agent AI",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(router)

@app.get("/")
def health():
    return {"status": "Travel Agent API running"}