"""
User Model for Production Database
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.sql import func
from datetime import datetime
from ..database.base import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    
    # Profile information
    bio = Column(Text, nullable=True)
    profile_picture_url = Column(String, nullable=True)
    location = Column(String, nullable=True)
    
    # Account status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    # Settings
    timezone = Column(String, default="UTC")
    language = Column(String, default="en")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, username={self.username})>"