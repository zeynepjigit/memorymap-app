from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from ..services.firestore_service import firestore_service

router = APIRouter(prefix="/api/v1/diary", tags=["diary"])

class DiaryEntryCreate(BaseModel):
    title: str
    content: str
    location: Optional[str] = None
    mood: Optional[str] = None

class DiaryEntryUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    location: Optional[str] = None
    mood: Optional[str] = None

class DiaryEntryResponse(BaseModel):
    id: str
    title: str
    content: str
    location: Optional[str] = None
    mood: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    user_id: str

@router.post("/", response_model=dict)
async def create_diary_entry(entry: DiaryEntryCreate):
    """Yeni günlük girişi oluştur"""
    try:
        # Şu an için test user_id kullanıyoruz
        user_id = "test_user_123"
        
        entry_data = {
            "title": entry.title,
            "content": entry.content,
            "location": entry.location,
            "mood": entry.mood
        }
        
        result = firestore_service.create_diary_entry(user_id, entry_data)
        
        if result["success"]:
            return {
                "success": True,
                "message": "Diary entry created successfully",
                "entry_id": result["entry_id"]
            }
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create diary entry: {str(e)}")

@router.get("/", response_model=dict)
async def get_diary_entries(limit: int = 10):
    """Günlük girişlerini listele"""
    try:
        # Şu an için test user_id kullanıyoruz
        user_id = "test_user_123"
        
        result = firestore_service.get_diary_entries(user_id, limit)
        
        if result["success"]:
            return {
                "success": True,
                "entries": result["entries"],
                "count": result["count"]
            }
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get diary entries: {str(e)}")

@router.get("/{entry_id}", response_model=dict)
async def get_diary_entry(entry_id: str):
    """Tekil günlük girişi getir"""
    try:
        result = firestore_service.get_diary_entry(entry_id)
        
        if result["success"]:
            return {
                "success": True,
                "entry": result["entry"]
            }
        else:
            raise HTTPException(status_code=404, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get diary entry: {str(e)}")

@router.put("/{entry_id}", response_model=dict)
async def update_diary_entry(entry_id: str, entry_update: DiaryEntryUpdate):
    """Günlük girişini güncelle"""
    try:
        # Sadece dolu alanları güncelle
        update_data = {}
        if entry_update.title is not None:
            update_data["title"] = entry_update.title
        if entry_update.content is not None:
            update_data["content"] = entry_update.content
        if entry_update.location is not None:
            update_data["location"] = entry_update.location
        if entry_update.mood is not None:
            update_data["mood"] = entry_update.mood
            
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        result = firestore_service.update_diary_entry(entry_id, update_data)
        
        if result["success"]:
            return {
                "success": True,
                "message": "Diary entry updated successfully"
            }
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update diary entry: {str(e)}")

@router.delete("/{entry_id}", response_model=dict)
async def delete_diary_entry(entry_id: str):
    """Günlük girişini sil"""
    try:
        result = firestore_service.delete_diary_entry(entry_id)
        
        if result["success"]:
            return {
                "success": True,
                "message": "Diary entry deleted successfully"
            }
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete diary entry: {str(e)}")

# Test endpoint'i
@router.get("/test/create-sample")
async def create_sample_diary():
    """Test için örnek günlük girişi oluştur"""
    sample_entry = DiaryEntryCreate(
        title="İlk Günlük Girdim",
        content="Bugün harika bir gün geçirdim! Firebase ile backend çalışıyor.",
        location="İstanbul",
        mood="Mutlu"
    )
    
    return await create_diary_entry(sample_entry) 