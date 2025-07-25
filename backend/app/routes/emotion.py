from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services.emotion_analysis import analyze_emotion

router = APIRouter(prefix="/api/v1/emotion", tags=["emotion"])

class EmotionRequest(BaseModel):
    text: str

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

# Test için basit GET endpoint
@router.get("/test")
async def test_emotion_endpoint():
    return {"message": "Emotion API is working!", "status": "success"} 