from firebase_admin import messaging
import schedule
import time
import threading
from datetime import datetime, timedelta
from typing import List, Dict
import json

# Bildirim şablonları
NOTIFICATION_TEMPLATES = {
    "daily_reminder": {
        "title": "Time to Reflect 📝",
        "body": "How was your day? Share your thoughts and feelings in your diary.",
        "icon": "📝"
    },
    "weekly_review": {
        "title": "Weekly Review 🗓️",
        "body": "Let's look back at your week and see how you've grown!",
        "icon": "🗓️"
    },
    "positive_encouragement": {
        "title": "You're doing great! ✨",
        "body": "Your recent entries show positive growth. Keep it up!",
        "icon": "✨"
    },
    "reflection_prompt": {
        "title": "Time for Self-Reflection 🤔",
        "body": "Here's a question to ponder: {question}",
        "icon": "🤔"
    },
    "achievement": {
        "title": "Achievement Unlocked! 🏆",
        "body": "You've reached a new milestone: {achievement}",
        "icon": "🏆"
    }
}

def send_notification_to_user(user_token: str, template_key: str, custom_data: Dict = None) -> Dict:
    """
    Kullanıcıya bildirim gönderir
    """
    try:
        if template_key not in NOTIFICATION_TEMPLATES:
            return {"success": False, "error": "Invalid template key"}
        
        template = NOTIFICATION_TEMPLATES[template_key].copy()
        
        # Özel veri ile şablonu doldur
        if custom_data:
            template["title"] = template["title"].format(**custom_data)
            template["body"] = template["body"].format(**custom_data)
        
        # FCM mesajı oluştur
        message = messaging.Message(
            notification=messaging.Notification(
                title=template["title"],
                body=template["body"]
            ),
            data={
                "template": template_key,
                "icon": template["icon"],
                "timestamp": str(int(time.time()))
            },
            token=user_token
        )
        
        # Gönder
        response = messaging.send(message)
        
        return {
            "success": True,
            "message_id": response,
            "template": template_key
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Notification send failed: {str(e)}"
        }

def send_bulk_notification(user_tokens: List[str], template_key: str, custom_data: Dict = None) -> Dict:
    """
    Birden fazla kullanıcıya aynı bildirimi gönderir
    """
    try:
        if template_key not in NOTIFICATION_TEMPLATES:
            return {"success": False, "error": "Invalid template key"}
        
        template = NOTIFICATION_TEMPLATES[template_key].copy()
        
        # Özel veri ile şablonu doldur
        if custom_data:
            template["title"] = template["title"].format(**custom_data)
            template["body"] = template["body"].format(**custom_data)
        
        # FCM çoklu mesaj oluştur
        messages = []
        for token in user_tokens:
            message = messaging.Message(
                notification=messaging.Notification(
                    title=template["title"],
                    body=template["body"]
                ),
                data={
                    "template": template_key,
                    "icon": template["icon"],
                    "timestamp": str(int(time.time()))
                },
                token=token
            )
            messages.append(message)
        
        # Toplu gönder
        response = messaging.send_all(messages)
        
        return {
            "success": True,
            "success_count": response.success_count,
            "failure_count": response.failure_count,
            "template": template_key
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Bulk notification send failed: {str(e)}"
        }

def schedule_daily_reminders():
    """
    Günlük hatırlatmaları zamanlar
    """
    schedule.every().day.at("20:00").do(send_daily_reminder)
    schedule.every().day.at("12:00").do(send_lunch_reflection)

def schedule_weekly_reviews():
    """
    Haftalık değerlendirmeleri zamanlar
    """
    schedule.every().sunday.at("19:00").do(send_weekly_review)

def send_daily_reminder():
    """
    Günlük hatırlatma gönderir (tüm aktif kullanıcılara)
    """
    # TODO: Veritabanından aktif kullanıcı token'larını çek
    # user_tokens = get_active_user_tokens()
    # send_bulk_notification(user_tokens, "daily_reminder")
    print(f"Daily reminder sent at {datetime.now()}")

def send_lunch_reflection():
    """
    Öğle arası yansıtma bildirimi gönderir
    """
    # TODO: Veritabanından aktif kullanıcı token'larını çek
    print(f"Lunch reflection sent at {datetime.now()}")

def send_weekly_review():
    """
    Haftalık değerlendirme bildirimi gönderir
    """
    # TODO: Veritabanından aktif kullanıcı token'larını çek
    # send_bulk_notification(user_tokens, "weekly_review")
    print(f"Weekly review sent at {datetime.now()}")

def start_notification_scheduler():
    """
    Bildirim zamanlayıcısını başlatır (arka plan thread'i)
    """
    schedule_daily_reminders()
    schedule_weekly_reviews()
    
    def run_scheduler():
        while True:
            schedule.run_pending()
            time.sleep(60)  # Her dakika kontrol et
    
    scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
    scheduler_thread.start()
    print("Notification scheduler started")

def create_personalized_notification(user_emotion_history: List[str], user_name: str = None) -> Dict:
    """
    Kullanıcının duygu geçmişine göre kişiselleştirilmiş bildirim oluşturur
    """
    if not user_emotion_history:
        return NOTIFICATION_TEMPLATES["daily_reminder"]
    
    recent_emotions = user_emotion_history[-5:]  # Son 5 duygu
    positive_count = recent_emotions.count("POSITIVE")
    negative_count = recent_emotions.count("NEGATIVE")
    
    # Duygu durumuna göre uygun şablon seç
    if positive_count >= 3:
        template = NOTIFICATION_TEMPLATES["positive_encouragement"]
    elif negative_count >= 3:
        template = {
            "title": "We're here for you 💙",
            "body": "It seems like you've been going through some challenges. Remember, every day is a new opportunity.",
            "icon": "💙"
        }
    else:
        template = NOTIFICATION_TEMPLATES["daily_reminder"]
    
    # İsim varsa kişiselleştir
    if user_name:
        template["title"] = f"Hi {user_name}! " + template["title"]
    
    return template 