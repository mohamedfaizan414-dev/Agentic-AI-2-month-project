import os
import streamlit as st
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 1. Access Secrets
# Locally: Create .streamlit/secrets.toml with: DATABASE_URL = "sqlite:///./test.db"
# Production: Set in Streamlit Cloud Dashboard
try:
    DATABASE_URL = st.secrets["DATABASE_URL"]
except Exception:
    # Fallback for local testing if secrets aren't set
    DATABASE_URL = "sqlite:///./travel_app.db"

# 2. Setup Engine
# check_same_thread=False is only needed for SQLite
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    connect_args=connect_args
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

def init_db():
    """
    Import models here to register them with Base.metadata
    Then create the tables.
    """
    import models
    Base.metadata.create_all(bind=engine)