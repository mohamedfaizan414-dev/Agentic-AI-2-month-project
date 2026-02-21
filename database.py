import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import streamlit as st


# Use Streamlit secrets in production
DATABASE_URL = st.secrets["DATABASE_URL"]

# Create engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()
def init_db():
    import models


Base.metadata.create_all(bind=engine)