"""
User Model for Production Database
"""

from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    id: Optional[str]
    email: str
    username: str
    full_name: Optional[str] = None
    hashed_password: str
    bio: Optional[str] = None
    profile_picture_url: Optional[str] = None
    location: Optional[str] = None
    is_active: bool = True
    is_verified: bool = False
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    last_login: Optional[str] = None
    timezone: Optional[str] = "UTC"
    language: Optional[str] = "en"