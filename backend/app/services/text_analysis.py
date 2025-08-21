import time
from typing import Any, Dict, List, Optional

from .providers.llm_openai import OpenAILLMProvider


THERAPY_SCHEMA: Dict[str, Any] = {
    "type": "object",
    "properties": {
        "affect": {
            "type": "object",
            "properties": {
                "primary_emotions": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "label": {"type": "string"},
                            "intensity": {"type": "number", "minimum": 0, "maximum": 1},
                        },
                        "required": ["label", "intensity"],
                    },
                },
                "valence": {"type": "number", "minimum": -1, "maximum": 1},
                "arousal": {"type": "number", "minimum": 0, "maximum": 1},
                "dominance": {"type": "number", "minimum": 0, "maximum": 1},
                "global_intensity": {"type": "number", "minimum": 0, "maximum": 1},
            },
            "required": ["primary_emotions", "valence", "arousal", "dominance", "global_intensity"],
        },
        "themes": {"type": "array", "items": {"type": "string"}, "minItems": 2, "maxItems": 7},
        "life_domains": {"type": "array", "items": {"type": "string"}, "minItems": 1, "maxItems": 5},
        "triggers": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "text": {"type": "string"},
                    "evidence": {"type": "string"},
                },
                "required": ["text", "evidence"],
            },
            "maxItems": 5,
        },
        "cognitive_patterns": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "label": {"type": "string"},
                    "evidence": {"type": "string"},
                },
                "required": ["label", "evidence"],
            },
            "maxItems": 5,
        },
        "unmet_needs": {"type": "array", "items": {"type": "string"}, "maxItems": 5},
        "summary": {"type": "string"},
        "reframe": {"type": "string"},
        "self_compassion": {"type": "string"},
        "coping_plan": {"type": "array", "items": {"type": "string"}, "minItems": 3, "maxItems": 7},
        "risk": {
            "type": "object",
            "properties": {
                "crisis_flags": {"type": "array", "items": {"type": "string"}},
                "self_harm_score": {"type": "number", "minimum": 0, "maximum": 1},
            },
            "required": ["crisis_flags", "self_harm_score"],
        },
        "quote": {
            "type": "object",
            "properties": {
                "text": {"type": "string"},
                "author": {"type": "string"},
            },
            "required": ["text", "author"],
        },
    },
    "required": [
        "affect",
        "themes",
        "life_domains",
        "summary",
        "reframe",
        "self_compassion",
        "coping_plan",
        "risk",
        "quote",
    ],
}


def analyze_diary_openai(text: str, locale: str = "tr", model: str = "gpt-4o-mini") -> Dict[str, Any]:
    start = time.time()
    llm = OpenAILLMProvider()
    system_prompt = (
        "Kısa, empatik ve kanıta dayalı bir terapist gibi analiz yap. Klinisyen değilsin; teşhis koyma. "
        "Her iddiayı metinden bir kanıt cümlesiyle ilişkilendir. Risk ipuçları varsa nazikçe işaret et."
    )
    user_prompt = (
        f"Dil: {locale}. Aşağıdaki günlük/rüya metnini analiz et ve şemaya tam uyan JSON döndür:\n\n{text}"
    )

    data = llm.chat_json(
        model=model,
        schema=THERAPY_SCHEMA,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.2,
        max_tokens=900,
    )
    latency_ms = int((time.time() - start) * 1000)
    if isinstance(data, dict):
        data.setdefault("provider_meta", {})
        data["provider_meta"].update({"model": model, "latency_ms": latency_ms})
    return data


def should_generate_image(text: str, analysis: Dict[str, Any]) -> bool:
    text_lower = (text or "").lower()
    dream_words = ["rüya", "ruya", "dream", "kabus", "uykuda", "uykudayken"]
    if any(w in text_lower for w in dream_words):
        return True
    for t in analysis.get("themes", []):
        if any(w in t.lower() for w in dream_words):
            return True
    return False


def build_sd_prompt(text: str, analysis: Dict[str, Any]) -> str:
    themes = ", ".join(analysis.get("themes", [])[:3])
    emotions = ", ".join(e.get("label") for e in analysis.get("affect", {}).get("primary_emotions", [])[:2])
    base = f"Dreamlike illustration of: {text[:200]}"
    style = "+ soft lighting, surreal, cinematic, detailed, atmospheric"
    hint = f"; themes: {themes}; emotions: {emotions}"
    return f"{base} {style} {hint}"


