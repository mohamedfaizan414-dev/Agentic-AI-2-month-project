import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

from urllib.parse import quote_plus
# Load environment variables
load_dotenv()

# DATABASE CONFIGURATION

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME")


encoded_password = quote_plus(DB_PASSWORD)

DATABASE_URL = (
    f"postgresql://{DB_USER}:{encoded_password}"
    f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)


# SQLALCHEMY ENGINE

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,      # prevents stale connections
    pool_size=5,             # connection pool size
    max_overflow=10          # extra temporary connections
)

# SESSION FACTORY

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# BASE CLASS FOR MODELS

Base = declarative_base()


# DEPENDENCY FUNCTION (OPTIONAL)

def get_db():
    """
    Use this function when you want a safe DB session.
    It automatically closes after use.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
