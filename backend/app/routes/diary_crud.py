from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from ..services.firestore_service import firestore_service
from ..utils.auth import get_current_user, CurrentUser
from ..services.emotion_analysis import analyze_emotion
from ..services.rag_coaching import rag_coaching_service
from ..services.text_analysis import analyze_diary_openai, should_generate_image, build_sd_prompt
from ..services.providers.images_fal import FalImageProvider

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
async def create_diary_entry(entry: DiaryEntryCreate, current_user: CurrentUser = Depends(get_current_user)):
    """Yeni günlük girişi oluştur"""
    try:
        # Authenticated user
        user_id = current_user.id
        
        # Legacy emotion analyzer removed for reliability on long texts; will map from OpenAI analysis below
        detected_emotion = None

        entry_data = {
            "title": entry.title,
            "content": entry.content,
            "location": entry.location,
            "mood": entry.mood or detected_emotion
        }
        
        result = firestore_service.create_diary_entry(user_id, entry_data)
        
        if result["success"]:
            entry_id = result["entry_id"]
            # 1. Terapist düzeyi analiz (senkron, kısa gecikme kabul)
            try:
                analysis = analyze_diary_openai(entry.content)
                # Map a simple emotion label for backward-compat
                try:
                    pe = analysis.get("affect", {}).get("primary_emotions", [])
                    if isinstance(pe, list) and len(pe) > 0 and isinstance(pe[0], dict):
                        detected_emotion = pe[0].get("label")
                except Exception:
                    pass
                # Firestore kayıt güncelle: analysis
                firestore_service.update_diary_entry(entry_id, {"analysis": analysis, "analysis_v": "v2_therapy"})
            except Exception:
                pass
            # 2) Add to vector DB for RAG insights (best-effort)
            try:
                date_str = datetime.utcnow().strftime('%Y-%m-%d')
                rag_coaching_service.add_diary_entry(
                    content=entry.content,
                    emotion=(entry_data.get("mood") or detected_emotion or "neutral"),
                    date=date_str,
                    location=(entry.location or ""),
                    tags=[],
                    user_id=user_id
                )
            except Exception:
                pass

            # 3) Rüya ise görsel üretim (best-effort)
            try:
                if should_generate_image(entry.content, analysis if 'analysis' in locals() else {}):
                    prompt = build_sd_prompt(entry.content, analysis if 'analysis' in locals() else {})
                    provider = FalImageProvider()
                    img_res = provider.generate(prompt)
                    if img_res.get("success"):
                        media = {"media": {"image_url": img_res["data"].get("image_url", img_res["data"].get("url")), "prompt": prompt, "image_provider": "fal"}}
                        firestore_service.update_diary_entry(entry_id, media)
            except Exception:
                pass

            return {
                "success": True,
                "message": "Diary entry created successfully",
                "entry_id": entry_id,
                "analysis": {
                    "emotion": detected_emotion
                },
                "analysis_v2": analysis if 'analysis' in locals() else None
            }
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create diary entry: {str(e)}")

@router.get("/", response_model=dict)
async def get_diary_entries(limit: int = 10, current_user: CurrentUser = Depends(get_current_user)):
    """Günlük girişlerini listele"""
    try:
        user_id = current_user.id
        
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

@router.delete("/clear/all", response_model=dict)
async def clear_all_diary_entries(current_user: CurrentUser = Depends(get_current_user)):
    """Kullanıcının tüm günlük girişlerini temizle"""
    try:
        user_id = current_user.id
        
        result = firestore_service.clear_all_diary_entries(user_id)
        
        if result["success"]:
            return {
                "success": True,
                "message": f"All diary entries cleared successfully. {result.get('deleted_count', 0)} entries deleted.",
                "deleted_count": result.get("deleted_count", 0)
            }
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear diary entries: {str(e)}")

@router.post("/seed-demo", response_model=dict)
async def seed_demo_entries(current_user: CurrentUser = Depends(get_current_user)):
    """Kullanıcı için demo günlük girişleri oluştur"""
    try:
        user_id = current_user.id
        
        result = firestore_service.seed_demo_entries_for_user(user_id)
        
        if result["success"]:
            return {
                "success": True,
                "message": "Demo entries created successfully",
                "created_entry_ids": result.get("created_entry_ids", [])
            }
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to seed demo entries: {str(e)}")

@router.get("/count", response_model=dict)
async def get_diary_entries_count(current_user: CurrentUser = Depends(get_current_user)):
    """Kullanıcının günlük giriş sayısını getir"""
    try:
        user_id = current_user.id
        
        result = firestore_service.get_diary_entries_count(user_id)
        
        if result["success"]:
            return {
                "success": True,
                "count": result["count"],
                "user_id": user_id
            }
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get diary entries count: {str(e)}")

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