from transformers import pipeline
import logging

# Model pipeline'ı global olarak başlat (ilk istek yavaş olabilir)
sentiment_analyzer = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

def analyze_emotion(text: str) -> dict:
    try:
        result = sentiment_analyzer(text)
        return {
            "emotion": result[0]["label"],
            "confidence": result[0]["score"],
            "text": text
        }
    except Exception as e:
        logging.error(f"Emotion analysis error: {e}")
        return {"error": "Analysis failed"} 