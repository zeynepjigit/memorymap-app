from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any
from ..services.emotion_analysis import analyze_emotion
from ..services.enhanced_emotion_analysis import enhanced_emotion_analyzer
from ..utils.auth import get_current_user
from ..utils.demo_auth import get_current_user_demo_async
from ..routes.production_auth import get_current_user as get_production_user

router = APIRouter(prefix="/api/v1/emotion", tags=["emotion"])

class EmotionRequest(BaseModel):
    text: str

class EnhancedEmotionRequest(BaseModel):
    text: str
    context: Optional[Dict[str, Any]] = None

@router.post("/analyze")
async def analyze_emotion_endpoint(req: EmotionRequest):
    if not req.text or len(req.text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Text is required")
    try:
        result = analyze_emotion(req.text)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/analyze/enhanced")
async def analyze_enhanced_emotion(
    req: EnhancedEmotionRequest,
    current_user = Depends(get_production_user)
):
    """
    Enhanced multi-dimensional emotion analysis
    """
    if not req.text or len(req.text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Text is required")
    
    try:
        result = await enhanced_emotion_analyzer.analyze_comprehensive_emotion(
            text=req.text,
            context=req.context
        )
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return {
            "success": True,
            "user_id": current_user.id,
            "analysis": result,
            "analysis_type": "enhanced_multi_dimensional"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Enhanced analysis failed: {str(e)}")

@router.post("/analyze/batch")
async def analyze_batch_emotions(
    texts: list[str],
    current_user = Depends(get_production_user)
):
    """
    Batch emotion analysis for multiple texts
    """
    if not texts or len(texts) == 0:
        raise HTTPException(status_code=400, detail="At least one text is required")
    
    if len(texts) > 50:  # Limit batch size
        raise HTTPException(status_code=400, detail="Maximum 50 texts per batch")
    
    try:
        results = []
        for i, text in enumerate(texts):
            if text and text.strip():
                analysis = await enhanced_emotion_analyzer.analyze_comprehensive_emotion(text)
                results.append({
                    "index": i,
                    "text": text[:100] + "..." if len(text) > 100 else text,
                    "analysis": analysis
                })
        
        return {
            "success": True,
            "user_id": current_user.id,
            "batch_size": len(texts),
            "processed_count": len(results),
            "results": results
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch analysis failed: {str(e)}")

@router.get("/emotions/categories")
async def get_emotion_categories():
    """
    Get available emotion categories and types
    """
    return {
        "success": True,
        "categories": enhanced_emotion_analyzer.emotion_categories,
        "intensity_levels": enhanced_emotion_analyzer.intensity_levels,
        "supported_analysis_types": [
            "basic_sentiment",
            "detailed_emotions", 
            "emotional_intensity",
            "contextual_analysis",
            "complex_emotions",
            "emotional_profile"
        ]
    }

# Test için basit GET endpoint
@router.get("/test")
async def test_emotion_endpoint():
    return {"message": "Emotion API is working!", "status": "success"} 