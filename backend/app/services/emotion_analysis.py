from transformers import pipeline
import logging
import os
import json
from typing import Dict, List, Optional, Any
from datetime import datetime

# Gemini import
try:
    from .providers.llm_gemini import GeminiLLMProvider
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

# Global pipeline (may be heavy for long texts). We'll truncate long inputs.
sentiment_analyzer = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

MAX_TOKENS_APPROX = 480  # safety margin under 512

def _truncate_text(text: str, max_chars: int = 2000) -> str:
    # Rough truncation to avoid model indexing errors on very long inputs
    return text if len(text) <= max_chars else text[:max_chars]

def analyze_emotion(text: str) -> dict:
    """Basit duygu analizi - HuggingFace ile"""
    try:
        safe_text = _truncate_text(text)
        result = sentiment_analyzer(safe_text)
        return {
            "emotion": result[0]["label"],
            "confidence": result[0]["score"],
            "text": safe_text
        }
    except Exception as e:
        logging.error(f"Emotion analysis error: {e}")
        return {"error": "Analysis failed"}

def analyze_emotion_deep_gemini(text: str, user_context: Optional[Dict] = None) -> dict:
    """
    Gemini ile derin duygu analizi
    Çok daha detaylı ve bağlamsal analiz sağlar
    """
    try:
        if not GEMINI_AVAILABLE or not os.getenv("GEMINI_API_KEY"):
            # Fallback to basic analysis
            return analyze_emotion(text)
        
        safe_text = _truncate_text(text, max_chars=3000)
        
        # Gemini provider'ı başlat
        llm = GeminiLLMProvider()
        
        # Detaylı analiz için prompt oluştur
        system_prompt = """Sen bir uzman psikolog ve duygu analizi uzmanısın. 
Kullanıcının günlük girdisini analiz ederek çok detaylı bir duygu analizi yap.

Analiz şu alanları içermeli:
1. Ana Duygu: En baskın duygu durumu
2. Duygu Yoğunluğu: 1-10 arası skala
3. Alt Duygular: Ana duyguya eşlik eden diğer duygular
4. Duygu Değişimi: Metin içinde duygu değişimi var mı?
5. Tetikleyiciler: Bu duyguları tetikleyen faktörler
6. Fiziksel Belirtiler: Duyguların fiziksel yansımaları
7. Davranışsal İpuçları: Duyguların davranışa yansıması
8. Sosyal Bağlam: İlişkiler ve sosyal durumlar
9. Zaman Perspektifi: Geçmiş, şimdi, gelecek odaklı mı?
10. Öneriler: Duygu yönetimi için öneriler

Yanıtı JSON formatında ver:
{
    "primary_emotion": "ana_duygu",
    "emotion_intensity": 7,
    "secondary_emotions": ["duygu1", "duygu2"],
    "emotion_shift": true/false,
    "triggers": ["tetikleyici1", "tetikleyici2"],
    "physical_signs": ["belirti1", "belirti2"],
    "behavioral_clues": ["ipucu1", "ipucu2"],
    "social_context": "sosyal_durum",
    "time_perspective": "geçmiş/şimdi/gelecek",
    "suggestions": ["öneri1", "öneri2"],
    "confidence_score": 0.95,
    "analysis_quality": "yüksek/orta/düşük"
}"""

        user_prompt = f"""Günlük Girdisi: "{safe_text}"

Lütfen bu metni detaylı olarak analiz et ve yukarıdaki JSON formatında yanıt ver.
Eğer metin Türkçe ise, yanıtı da Türkçe ver."""

        # Gemini'den yanıt al
        response = llm.chat_text(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=1200
        )
        
        # JSON parse et
        try:
            analysis_result = json.loads(response)
            
            # Sonuçları doğrula ve tamamla
            validated_result = {
                "success": True,
                "analysis_type": "gemini_deep",
                "timestamp": datetime.now().isoformat(),
                "text": safe_text,
                "primary_emotion": analysis_result.get("primary_emotion", "unknown"),
                "emotion_intensity": analysis_result.get("emotion_intensity", 5),
                "secondary_emotions": analysis_result.get("secondary_emotions", []),
                "emotion_shift": analysis_result.get("emotion_shift", False),
                "triggers": analysis_result.get("triggers", []),
                "physical_signs": analysis_result.get("physical_signs", []),
                "behavioral_clues": analysis_result.get("behavioral_clues", []),
                "social_context": analysis_result.get("social_context", ""),
                "time_perspective": analysis_result.get("time_perspective", "present"),
                "suggestions": analysis_result.get("suggestions", []),
                "confidence_score": analysis_result.get("confidence_score", 0.8),
                "analysis_quality": analysis_result.get("analysis_quality", "high"),
                "raw_gemini_response": response
            }
            
            return validated_result
            
        except json.JSONDecodeError:
            # JSON parse edilemezse, basit analiz yap
            logging.warning("Gemini response could not be parsed as JSON, falling back to basic analysis")
            basic_result = analyze_emotion(text)
            basic_result["analysis_type"] = "fallback_basic"
            basic_result["gemini_raw_response"] = response
            return basic_result
            
    except Exception as e:
        logging.error(f"Deep emotion analysis error: {e}")
        # Hata durumunda basit analize dön
        basic_result = analyze_emotion(text)
        basic_result["analysis_type"] = "error_fallback"
        basic_result["error"] = str(e)
        return basic_result

def analyze_emotion_comparative(text: str, previous_entries: Optional[List[Dict]] = None) -> dict:
    """
    Geçmiş girdilerle karşılaştırmalı duygu analizi
    Duygu trendlerini ve değişimleri analiz eder
    """
    try:
        if not GEMINI_AVAILABLE or not os.getenv("GEMINI_API_KEY"):
            return analyze_emotion_deep_gemini(text)
        
        safe_text = _truncate_text(text, max_chars=3000)
        
        # Gemini provider'ı başlat
        llm = GeminiLLMProvider()
        
        # Geçmiş girdileri hazırla
        context_text = ""
        if previous_entries and len(previous_entries) > 0:
            context_text = "\n\nGeçmiş Girdiler:\n"
            for i, entry in enumerate(previous_entries[-3:]):  # Son 3 girdi
                context_text += f"{i+1}. {entry.get('content', '')[:200]}...\n"
        
        system_prompt = """Sen bir psikolog ve duygu trend analisti olarak çalışıyorsun.
Kullanıcının yeni günlük girdisini, geçmiş girdileriyle karşılaştırarak analiz et.

Analiz şu alanları içermeli:
1. Duygu Trendi: Son zamanlarda duygu durumunda nasıl bir değişim var?
2. Tekrarlayan Temalar: Hangi konular/duygular sürekli tekrarlanıyor?
3. İyileşme/Gerileme: Duygu durumunda iyileşme mi var yoksa gerileme mi?
4. Tetikleyici Kalıpları: Hangi durumlar sürekli aynı duyguları tetikliyor?
5. Başa Çıkma Stratejileri: Kullanıcı nasıl başa çıkıyor?
6. Öneriler: Trend'e göre öneriler

JSON formatında yanıt ver:
{
    "current_emotion": "şu_anki_duygu",
    "emotion_trend": "iyileşme/gerileme/kararlı",
    "recurring_themes": ["tema1", "tema2"],
    "trigger_patterns": ["kalıp1", "kalıp2"],
    "coping_strategies": ["strateji1", "strateji2"],
    "trend_suggestions": ["öneri1", "öneri2"],
    "trend_confidence": 0.9
}"""

        user_prompt = f"""Yeni Günlük Girdisi: "{safe_text}"{context_text}

Bu yeni girdiyi geçmiş girdilerle karşılaştırarak analiz et."""

        # Gemini'den yanıt al
        response = llm.chat_text(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.4,
            max_tokens=1000
        )
        
        try:
            trend_result = json.loads(response)
            
            return {
                "success": True,
                "analysis_type": "gemini_comparative",
                "timestamp": datetime.now().isoformat(),
                "text": safe_text,
                "current_emotion": trend_result.get("current_emotion", "unknown"),
                "emotion_trend": trend_result.get("emotion_trend", "stable"),
                "recurring_themes": trend_result.get("recurring_themes", []),
                "trigger_patterns": trend_result.get("trigger_patterns", []),
                "coping_strategies": trend_result.get("coping_strategies", []),
                "trend_suggestions": trend_result.get("trend_suggestions", []),
                "trend_confidence": trend_result.get("trend_confidence", 0.8),
                "previous_entries_analyzed": len(previous_entries) if previous_entries else 0,
                "raw_gemini_response": response
            }
            
        except json.JSONDecodeError:
            return analyze_emotion_deep_gemini(text)
            
    except Exception as e:
        logging.error(f"Comparative emotion analysis error: {e}")
        return analyze_emotion_deep_gemini(text)

def get_emotion_summary(user_id: str, time_period: str = "week") -> dict:
    """
    Belirli bir zaman dilimi için duygu özeti
    """
    try:
        if not GEMINI_AVAILABLE or not os.getenv("GEMINI_API_KEY"):
            return {"error": "Gemini not available for summary"}
        
        # Bu fonksiyon için Firestore'dan kullanıcının girdilerini almak gerekir
        # Şimdilik placeholder
        return {
            "success": True,
            "analysis_type": "emotion_summary",
            "time_period": time_period,
            "summary": "Emotion summary feature requires database integration"
        }
        
    except Exception as e:
        logging.error(f"Emotion summary error: {e}")
        return {"error": str(e)}

# Ana analiz fonksiyonu - kullanım kolaylığı için
def analyze_emotion_enhanced(text: str, analysis_type: str = "deep", **kwargs) -> dict:
    """
    Gelişmiş duygu analizi - farklı analiz türleri için wrapper
    
    Args:
        text: Analiz edilecek metin
        analysis_type: "basic", "deep", "comparative"
        **kwargs: Ek parametreler (previous_entries, user_context vb.)
    """
    if analysis_type == "basic":
        return analyze_emotion(text)
    elif analysis_type == "deep":
        return analyze_emotion_deep_gemini(text, kwargs.get("user_context"))
    elif analysis_type == "comparative":
        return analyze_emotion_comparative(text, kwargs.get("previous_entries"))
    else:
        return analyze_emotion_deep_gemini(text)