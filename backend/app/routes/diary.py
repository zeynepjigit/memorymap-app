from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from ..services.emotion_analysis import analyze_emotion
from ..services.location_extraction import extract_locations
from ..services.location_extraction import get_coordinates
from ..services.image_generation import generate_image_from_prompt, create_prompt_from_diary_entry
from ..services.firebase import upload_image_to_storage, delete_image_from_storage, list_user_images
from ..utils.auth import get_current_user
import base64
import uuid
from ..services.coaching import generate_reflective_questions, generate_personal_development_advice, analyze_progress
from ..services.notifications import send_notification_to_user, send_bulk_notification, create_personalized_notification
from ..services.analytics_backend import analytics_tracker, track_user_action, track_model_usage
from datetime import datetime
import time

router = APIRouter(prefix="/emotion", tags=["emotion"])

class EmotionRequest(BaseModel):
    text: str

@router.post("/analyze")
def emotion_analyze_with_tracking(req: EmotionRequest, current_user=Depends(get_current_user)):
    if not req.text or len(req.text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Text is required")
    
    try:
        result = analyze_emotion(req.text)
        
        # Analytics tracking
        track_user_action(current_user.id, "emotion_analysis", {"text_length": len(req.text)})
        track_model_usage("emotion_analysis", req.text, str(result), result.get("score"))
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}") 

class LocationRequest(BaseModel):
    text: str

@router.post("/location/extract")
def location_extract(req: LocationRequest):
    if not req.text or len(req.text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Text is required")
    locations = extract_locations(req.text)
    return {"locations": locations} 

class GeocodeRequest(BaseModel):
    location_name: str

@router.post("/location/geocode")
def geocode_location(req: GeocodeRequest):
    if not req.location_name or len(req.location_name.strip()) == 0:
        raise HTTPException(status_code=400, detail="Location name is required")
    coords = get_coordinates(req.location_name)
    if coords is None:
        raise HTTPException(status_code=404, detail="Location not found")
    return coords 

class ImageGenerationRequest(BaseModel):
    diary_text: str
    emotion: str = None
    locations: list = []

@router.post("/image/generate")
def generate_image(req: ImageGenerationRequest):
    if not req.diary_text or len(req.diary_text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Diary text is required")
    
    try:
        # Günlük girdisinden prompt oluştur
        prompt = create_prompt_from_diary_entry(
            req.diary_text, 
            req.emotion, 
            req.locations
        )
        
        # Görsel üret
        result = generate_image_from_prompt(prompt)
        
        if result["success"]:
            return {
                "success": True,
                "image_base64": result["image_base64"],
                "prompt": result["prompt"],
                "message": "Image generated successfully"
            }
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image generation failed: {str(e)}") 

class ImageSaveRequest(BaseModel):
    image_base64: str
    diary_entry_id: int = None
    title: str = "Generated Image"

@router.post("/image/save")
def save_image_to_storage(req: ImageSaveRequest, current_user=Depends(get_current_user)):
    if not req.image_base64:
        raise HTTPException(status_code=400, detail="Image data is required")
    
    try:
        # Base64'ten bytes'a çevir
        image_bytes = base64.b64decode(req.image_base64)
        
        # Dosya adı oluştur
        filename = f"user_{current_user.id}_{uuid.uuid4()}.png"
        
        # Firebase Storage'a yükle
        result = upload_image_to_storage(image_bytes, filename, "generated_images")
        
        if result["success"]:
            # TODO: Veritabanına görsel kaydını ekle (diary_entry_id ile ilişkili)
            return {
                "success": True,
                "url": result["url"],
                "filename": result["filename"],
                "message": "Image saved successfully"
            }
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Save failed: {str(e)}")

@router.get("/images/list")
def list_user_images_endpoint(current_user=Depends(get_current_user)):
    try:
        result = list_user_images(current_user.id, "generated_images")
        
        if result["success"]:
            return result
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"List failed: {str(e)}")

@router.delete("/image/{file_path:path}")
def delete_image_endpoint(file_path: str, current_user=Depends(get_current_user)):
    try:
        # Güvenlik: Sadece kendi görsellerini silebilir
        if f"user_{current_user.id}_" not in file_path:
            raise HTTPException(status_code=403, detail="Access denied")
        
        result = delete_image_from_storage(file_path)
        
        if result["success"]:
            return result
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}") 

class ReflectiveQuestionsRequest(BaseModel):
    diary_text: str
    emotion: str = None
    user_history: list = []

class PersonalAdviceRequest(BaseModel):
    diary_entries: list
    emotions: list = []

class ProgressAnalysisRequest(BaseModel):
    user_responses: list
    time_period_days: int = 30

@router.post("/coaching/questions")
def get_reflective_questions(req: ReflectiveQuestionsRequest, current_user=Depends(get_current_user)):
    if not req.diary_text or len(req.diary_text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Diary text is required")
    
    try:
        result = generate_reflective_questions(
            req.diary_text,
            req.emotion,
            req.user_history
        )
        
        if result["success"]:
            return result
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Question generation failed: {str(e)}")

@router.post("/coaching/advice")
def get_personal_advice(req: PersonalAdviceRequest, current_user=Depends(get_current_user)):
    if not req.diary_entries or len(req.diary_entries) == 0:
        raise HTTPException(status_code=400, detail="At least one diary entry is required")
    
    try:
        result = generate_personal_development_advice(
            req.diary_entries,
            req.emotions
        )
        
        if result["success"]:
            return result
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Advice generation failed: {str(e)}")

@router.post("/coaching/progress")
def analyze_user_progress(req: ProgressAnalysisRequest, current_user=Depends(get_current_user)):
    if not req.user_responses or len(req.user_responses) == 0:
        raise HTTPException(status_code=400, detail="User responses are required for analysis")
    
    try:
        result = analyze_progress(
            req.user_responses,
            req.time_period_days
        )
        
        if result["success"]:
            return result
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Progress analysis failed: {str(e)}") 

class NotificationRequest(BaseModel):
    template_key: str
    custom_data: dict = {}

class BulkNotificationRequest(BaseModel):
    user_tokens: list
    template_key: str
    custom_data: dict = {}

@router.post("/notifications/send")
def send_notification(req: NotificationRequest, current_user=Depends(get_current_user)):
    # TODO: Kullanıcının FCM token'ını veritabanından çek
    user_token = "dummy_token"  # Gerçek implementasyonda veritabanından çekilecek
    
    try:
        result = send_notification_to_user(
            user_token,
            req.template_key,
            req.custom_data
        )
        
        if result["success"]:
            return result
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Notification send failed: {str(e)}")

@router.post("/notifications/bulk")
def send_bulk_notifications(req: BulkNotificationRequest, current_user=Depends(get_current_user)):
    # Admin kontrolü yapılabilir
    try:
        result = send_bulk_notification(
            req.user_tokens,
            req.template_key,
            req.custom_data
        )
        
        if result["success"]:
            return result
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bulk notification send failed: {str(e)}")

@router.get("/notifications/templates")
def get_notification_templates():
    from ..services.notifications import NOTIFICATION_TEMPLATES
    return {"templates": NOTIFICATION_TEMPLATES}

@router.post("/notifications/personalized")
def get_personalized_notification(current_user=Depends(get_current_user)):
    # TODO: Kullanıcının duygu geçmişini veritabanından çek
    user_emotion_history = ["POSITIVE", "NEUTRAL", "POSITIVE"]  # Mock data
    
    try:
        template = create_personalized_notification(
            user_emotion_history,
            current_user.name
        )
        
        return {"template": template, "user_name": current_user.name}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Personalized notification failed: {str(e)}") 

@router.get("/analytics/user")
def get_user_analytics(days: int = 30, current_user=Depends(get_current_user)):
    try:
        analytics_data = analytics_tracker.get_user_analytics(current_user.id, days)
        return analytics_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analytics retrieval failed: {str(e)}")

@router.get("/analytics/system")
def get_system_analytics(days: int = 7, current_user=Depends(get_current_user)):
    # Admin kontrolü yapılabilir
    try:
        system_data = analytics_tracker.get_system_analytics(days)
        return system_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"System analytics retrieval failed: {str(e)}")

@router.get("/analytics/models")
def get_model_analytics(model_type: str = None, days: int = 30, current_user=Depends(get_current_user)):
    try:
        model_data = analytics_tracker.get_model_performance_report(model_type, days)
        return model_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model analytics retrieval failed: {str(e)}") 

class FeedbackRequest(BaseModel):
    rating: int
    category: str
    message: str
    features: list = []
    improvements: str = ""
    recommend: bool = True
    email: str = ""

@router.post("/feedback/submit")
def submit_feedback(req: FeedbackRequest, current_user=Depends(get_current_user)):
    try:
        # Geri bildirim verilerini logla (gerçek implementasyonda veritabanına kaydedilecek)
        feedback_data = {
            "user_id": current_user.id,
            "user_email": current_user.email,
            "rating": req.rating,
            "category": req.category,
            "message": req.message,
            "features_used": req.features,
            "improvements": req.improvements,
            "would_recommend": req.recommend,
            "contact_email": req.email,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Analytics tracking
        track_user_action(current_user.id, "feedback_submitted", {
            "rating": req.rating,
            "category": req.category,
            "features_count": len(req.features)
        })
        
        # TODO: Veritabanına kaydet
        # feedback_service.save_feedback(feedback_data)
        
        print(f"Feedback received: {feedback_data}")
        
        return {
            "success": True,
            "message": "Feedback submitted successfully",
            "feedback_id": f"fb_{current_user.id}_{int(time.time())}"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Feedback submission failed: {str(e)}")

@router.get("/feedback/stats")
def get_feedback_stats():
    # Mock istatistik verileri (gerçek implementasyonda veritabanından çekilecek)
    return {
        "average_rating": 4.8,
        "total_reviews": 156,
        "recommendation_rate": 0.89,
        "category_distribution": {
            "general": 45,
            "ui_ux": 32,
            "ai_features": 28,
            "performance": 18,
            "bug_report": 15,
            "feature_request": 18
        },
        "most_used_features": [
            "Diary Entry Creation",
            "Emotion Analysis",
            "Memory Map",
            "AI Image Generation"
        ]
    } 