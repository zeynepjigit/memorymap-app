from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DiaryEntry(BaseModel):
    id: Optional[str]
    user_id: str
    title: str
    content: str
    location: Optional[str] = None
    mood: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None 