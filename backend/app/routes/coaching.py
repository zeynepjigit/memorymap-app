from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from ..services.rag_coaching import rag_coaching_service
from ..utils.auth import get_current_user
from ..models.user import User

router = APIRouter(prefix="/coaching", tags=["coaching"])

# Request/Response Models
class DiaryEntryRequest(BaseModel):
    content: str
    emotion: str
    date: str
    location: Optional[str] = ""
    tags: Optional[List[str]] = []

class QueryRequest(BaseModel):
    question: str
    top_k: Optional[int] = 5

class AdviceRequest(BaseModel):
    question: str

class DiaryEntryResponse(BaseModel):
    success: bool
    entry_id: Optional[str] = None
    message: Optional[str] = None
    error: Optional[str] = None

class QueryResponse(BaseModel):
    success: bool
    results: Optional[List[dict]] = None
    query: Optional[str] = None
    error: Optional[str] = None

class AdviceResponse(BaseModel):
    success: bool
    advice: Optional[str] = None
    relevant_entries: Optional[List[dict]] = None
    explanation: Optional[str] = None
    error: Optional[str] = None

class InsightsResponse(BaseModel):
    success: bool
    insights: Optional[dict] = None
    error: Optional[str] = None

class ExplainableAIResponse(BaseModel):
    success: bool
    explanation: Optional[str] = None
    confidence_score: Optional[float] = None
    recommendation_strength: Optional[str] = None
    patterns: Optional[List[dict]] = None
    evidence: Optional[List[dict]] = None
    reasoning_chain: Optional[List[str]] = None
    error: Optional[str] = None

@router.post("/add-entry", response_model=DiaryEntryResponse)
async def add_diary_entry(
    entry: DiaryEntryRequest
    # current_user: User = Depends(get_current_user)  # Demo için kaldırıldı
):
    """Yeni günlük girdisi ekler ve vektör veritabanına kaydeder"""
    try:
        result = rag_coaching_service.add_diary_entry(
            content=entry.content,
            emotion=entry.emotion,
            date=entry.date,
            location=entry.location,
            tags=entry.tags
        )
        
        if result["success"]:
            return DiaryEntryResponse(
                success=True,
                entry_id=result["entry_id"],
                message=result["message"]
            )
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Günlük girdisi eklenirken hata: {str(e)}")

@router.post("/query", response_model=QueryResponse)
async def query_diary_entries(
    query: QueryRequest
    # current_user: User = Depends(get_current_user)  # Demo için kaldırıldı
):
    """Günlük girdilerini sorgular"""
    try:
        result = rag_coaching_service.query_diary(
            question=query.question,
            top_k=query.top_k
        )
        
        if result["success"]:
            return QueryResponse(
                success=True,
                results=result["results"],
                query=result["query"]
            )
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sorgu sırasında hata: {str(e)}")

@router.post("/advice", response_model=AdviceResponse)
async def get_personalized_advice(
    request: AdviceRequest
    # current_user: User = Depends(get_current_user)  # Demo için kaldırıldı
):
    """Kişiselleştirilmiş tavsiye alır"""
    try:
        result = rag_coaching_service.generate_personalized_advice(
            question=request.question
        )
        
        if result["success"]:
            return AdviceResponse(
                success=True,
                advice=result["advice"],
                relevant_entries=result["relevant_entries"],
                explanation=result["explanation"]
            )
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tavsiye üretimi sırasında hata: {str(e)}")

@router.get("/insights", response_model=InsightsResponse)
async def get_emotional_insights(
    # current_user: User = Depends(get_current_user)  # Demo için kaldırıldı
):
    """Duygu durumu analizi ve içgörüler alır"""
    try:
        result = rag_coaching_service.get_emotional_insights(
            user_id="demo_user"  # Demo için sabit user ID
        )
        
        if result["success"]:
            return InsightsResponse(
                success=True,
                insights=result["insights"]
            )
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"İçgörü analizi sırasında hata: {str(e)}")

@router.get("/demo-data")
async def get_demo_data():
    """Demo verilerini döndürür (test amaçlı)"""
    try:
        # Demo verileri JSON formatında döndür
        demo_data = [
            {
                "id": "demo_1",
                "content": "Bugün iş yerinde çok stresli bir gün geçirdim. Proje teslim tarihi yaklaşıyor ve henüz bitiremedim. Patronum sürekli durumu soruyor ve bu beni daha da kaygılandırıyor. Eve geldiğimde kendimi yorgun ve bitkin hissediyorum.",
                "emotion": "stres",
                "date": "2024-01-15",
                "location": "İstanbul, Türkiye",
                "tags": ["iş", "stres", "proje", "kaygı"]
            },
            {
                "id": "demo_2", 
                "content": "Hafta sonu arkadaşlarımla pikniğe gittik. Havalar çok güzeldi ve güzel vakit geçirdik. Yemek yerken eski anılarımızı konuştuk ve çok güldük. Bu tür sosyal aktiviteler beni gerçekten mutlu ediyor.",
                "emotion": "mutlu",
                "date": "2024-01-20",
                "location": "Belgrad Ormanı, İstanbul",
                "tags": ["arkadaşlar", "piknik", "sosyal", "mutlu"]
            },
            {
                "id": "demo_3",
                "content": "Geçen hafta aldığım kitabı bitirdim. 'İnsanın Anlam Arayışı' gerçekten etkileyici bir kitaptı. Viktor Frankl'ın deneyimleri beni derinden etkiledi. Hayatın anlamını bulma konusunda yeni perspektifler kazandım.",
                "emotion": "düşünceli",
                "date": "2024-01-25",
                "location": "Ev, İstanbul",
                "tags": ["kitap", "felsefe", "anlam", "düşünce"]
            },
            {
                "id": "demo_4",
                "content": "Bugün spor salonunda yeni bir egzersiz programına başladım. Antrenör bana özel bir program hazırladı. İlk gün olduğu için biraz zorlandım ama kendimi iyi hissettim. Düzenli spor yapmanın hem fiziksel hem de zihinsel sağlığım için önemli olduğunu düşünüyorum.",
                "emotion": "motivasyonlu",
                "date": "2024-01-28",
                "location": "Spor Salonu, İstanbul",
                "tags": ["spor", "sağlık", "motivasyon", "egzersiz"]
            },
            {
                "id": "demo_5",
                "content": "Ailemle akşam yemeği yerken annem sağlık sorunlarından bahsetti. Bu beni endişelendirdi. Onun yaşlanması ve sağlık problemleri yaşaması beni düşündürüyor. Ailemle daha fazla zaman geçirmem gerektiğini hissettim.",
                "emotion": "endişeli",
                "date": "2024-01-30",
                "location": "Ev, İstanbul", 
                "tags": ["aile", "sağlık", "endişe", "yaşlanma"]
            }
        ]
        
        return {
            "success": True,
            "demo_data": demo_data,
            "message": "Demo verileri başarıyla yüklendi"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Demo verileri alınırken hata: {str(e)}")

@router.post("/explain", response_model=ExplainableAIResponse)
async def explain_advice(
    request: AdviceRequest
    # current_user: User = Depends(get_current_user)  # Demo için kaldırıldı
):
    """AI tavsiyesinin nedenini açıklar"""
    try:
        # Önce tavsiye al
        advice_result = rag_coaching_service.generate_personalized_advice(
            question=request.question
        )
        
        if not advice_result["success"]:
            raise HTTPException(status_code=400, detail=advice_result["error"])
        
        # Explainable AI verilerini döndür
        explainable_data = advice_result.get("explainable_ai", {})
        
        return ExplainableAIResponse(
            success=True,
            explanation=explainable_data.get("explanation"),
            confidence_score=explainable_data.get("confidence_score"),
            recommendation_strength=explainable_data.get("recommendation_strength"),
            patterns=explainable_data.get("patterns"),
            evidence=explainable_data.get("evidence"),
            reasoning_chain=explainable_data.get("reasoning_chain")
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tavsiye açıklaması sırasında hata: {str(e)}")
