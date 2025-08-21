from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from ..services.quote_service import quote_service
from ..utils.auth import get_current_user, CurrentUser

router = APIRouter(prefix="/api/v1/quotes", tags=["quotes"])

class QuoteRequest(BaseModel):
    emotion: str
    diary_content: Optional[str] = ""

class QuoteResponse(BaseModel):
    success: bool
    quote: Optional[str] = None
    author: Optional[str] = None
    emotion: Optional[str] = None
    colors: Optional[dict] = None
    timestamp: Optional[str] = None
    error: Optional[str] = None

class QuoteHistoryResponse(BaseModel):
    success: bool
    quotes: Optional[List[dict]] = None
    error: Optional[str] = None

@router.post("/generate", response_model=QuoteResponse)
async def generate_quote(
    request: QuoteRequest,
    current_user: CurrentUser = Depends(get_current_user)
):
    """Generate an inspirational quote based on user's emotion and diary content"""
    try:
        if not request.emotion:
            raise HTTPException(status_code=400, detail="Emotion is required")
        
        result = quote_service.generate_inspirational_quote(
            emotion=request.emotion,
            diary_content=request.diary_content
        )
        
        if result["success"]:
            return QuoteResponse(
                success=True,
                quote=result["quote"],
                author=result["author"],
                emotion=result["emotion"],
                colors=result["colors"],
                timestamp=result["timestamp"]
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to generate quote")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quote generation failed: {str(e)}")

@router.get("/history", response_model=QuoteHistoryResponse)
async def get_quote_history(
    limit: int = 10,
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get user's quote history"""
    try:
        quotes = quote_service.get_quote_history(
            user_id=str(current_user.id),
            limit=limit
        )
        
        return QuoteHistoryResponse(
            success=True,
            quotes=quotes
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get quote history: {str(e)}")

@router.get("/colors/{emotion}")
async def get_emotion_colors(emotion: str):
    """Get color palette for a specific emotion"""
    try:
        colors = quote_service.emotion_colors.get(emotion.upper(), quote_service.emotion_colors["NEUTRAL"])
        return {
            "success": True,
            "emotion": emotion.upper(),
            "colors": colors
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get emotion colors: {str(e)}")
