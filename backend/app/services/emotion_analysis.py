from transformers import pipeline
import logging

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