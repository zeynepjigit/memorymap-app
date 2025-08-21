from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from ..services.emotion_analysis import (
    analyze_emotion, 
    analyze_emotion_deep_gemini, 
    analyze_emotion_comparative,
    analyze_emotion_enhanced,
    get_emotion_summary
)
from ..utils.auth import get_current_user, CurrentUser

router = APIRouter(prefix="/api/v1/emotion", tags=["emotion"])

class EmotionRequest(BaseModel):
    text: str
    analysis_type: Optional[str] = "deep"  # "basic", "deep", "comparative"
    user_context: Optional[Dict[str, Any]] = None

class ComparativeEmotionRequest(BaseModel):
    text: str
    previous_entries: Optional[List[Dict[str, Any]]] = None

class EmotionSummaryRequest(BaseModel):
    time_period: str = "week"  # "day", "week", "month"
    user_id: Optional[str] = None

@router.post("/analyze")
async def analyze_emotion_endpoint(req: EmotionRequest):
    """Temel duygu analizi endpoint'i"""
    if not req.text or len(req.text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Text is required")
    try:
        result = analyze_emotion(req.text)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/analyze/deep")
async def analyze_emotion_deep_endpoint(req: EmotionRequest):
    """Gemini ile derin duygu analizi"""
    if not req.text or len(req.text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Text is required")
    try:
        result = analyze_emotion_deep_gemini(req.text, req.user_context)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Deep analysis failed: {str(e)}")

@router.post("/analyze/comparative")
async def analyze_emotion_comparative_endpoint(req: ComparativeEmotionRequest):
    """Geçmiş girdilerle karşılaştırmalı duygu analizi"""
    if not req.text or len(req.text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Text is required")
    try:
        result = analyze_emotion_comparative(req.text, req.previous_entries)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comparative analysis failed: {str(e)}")

@router.post("/analyze/enhanced")
async def analyze_emotion_enhanced_endpoint(
    req: EmotionRequest,
    current_user: CurrentUser = Depends(get_current_user)
):
    """Gelişmiş duygu analizi - tüm analiz türlerini destekler"""
    if not req.text or len(req.text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Text is required")
    
    try:
        # Analiz türüne göre parametreleri hazırla
        kwargs = {}
        if req.analysis_type == "comparative":
            # Geçmiş girdileri al (Firestore'dan)
            from ..services.firestore_service import firestore_service
            previous_entries_result = firestore_service.get_diary_entries(
                user_id=current_user.id, 
                limit=5
            )
            if previous_entries_result.get("success"):
                kwargs["previous_entries"] = previous_entries_result.get("entries", [])
        
        if req.user_context:
            kwargs["user_context"] = req.user_context
        
        result = analyze_emotion_enhanced(
            text=req.text,
            analysis_type=req.analysis_type,
            **kwargs
        )
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Enhanced analysis failed: {str(e)}")

@router.get("/summary")
async def get_emotion_summary_endpoint(
    time_period: str = Query("week", description="Time period: day, week, month"),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Belirli zaman dilimi için duygu özeti"""
    try:
        result = get_emotion_summary(current_user.id, time_period)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summary generation failed: {str(e)}")

@router.get("/analysis-types")
async def get_available_analysis_types():
    """Mevcut analiz türlerini listele"""
    return {
        "analysis_types": [
            {
                "type": "basic",
                "name": "Temel Analiz",
                "description": "HuggingFace ile basit pozitif/negatif analiz",
                "features": ["Ana duygu", "Güven skoru"],
                "provider": "HuggingFace DistilBERT"
            },
            {
                "type": "deep",
                "name": "Derin Analiz",
                "description": "Gemini ile detaylı psikolojik analiz",
                "features": [
                    "Ana duygu", "Duygu yoğunluğu", "Alt duygular",
                    "Tetikleyiciler", "Fiziksel belirtiler", "Davranışsal ipuçları",
                    "Sosyal bağlam", "Zaman perspektifi", "Öneriler"
                ],
                "provider": "Google Gemini 1.5 Flash"
            },
            {
                "type": "comparative",
                "name": "Karşılaştırmalı Analiz",
                "description": "Geçmiş girdilerle trend analizi",
                "features": [
                    "Duygu trendi", "Tekrarlayan temalar", "Tetikleyici kalıpları",
                    "Başa çıkma stratejileri", "Trend önerileri"
                ],
                "provider": "Google Gemini 1.5 Flash"
            }
        ]
    }

@router.get("/test")
async def test_emotion_endpoint():
    """Test endpoint'i"""
    return {
        "message": "Enhanced Emotion API is working!", 
        "status": "success",
        "features": [
            "Basic emotion analysis (HuggingFace)",
            "Deep emotion analysis (Gemini)",
            "Comparative analysis (Gemini)",
            "Emotion summaries",
            "Multiple analysis types"
        ]
    }

@router.post("/test/deep")
async def test_deep_analysis():
    """Derin analiz test endpoint'i"""
    test_text = "Bugün çok güzel bir gün geçirdim. Arkadaşlarımla pikniğe gittik ve harika vakit geçirdik. Ancak akşam eve dönerken biraz yoruldum ama genel olarak mutluyum."
    
    try:
        result = analyze_emotion_deep_gemini(test_text)
        return {
            "test_text": test_text,
            "result": result,
            "status": "success"
        }
    except Exception as e:
        return {
            "test_text": test_text,
            "error": str(e),
            "status": "error"
        } 