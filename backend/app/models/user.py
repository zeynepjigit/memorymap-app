# User model 
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from ..utils.database import Base

# User table definition for the database
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)  # Unique user ID
    email = Column(String, unique=True, index=True, nullable=False)  # User's email (must be unique)
    name = Column(String, nullable=False)  # User's name
    hashed_password = Column(String, nullable=False)  # Hashed password for security
    created_at = Column(DateTime(timezone=True), server_default=func.now())  # Registration timestamp