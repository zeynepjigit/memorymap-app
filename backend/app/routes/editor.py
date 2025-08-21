from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from ..services.providers.llm_openai import OpenAILLMProvider


router = APIRouter(prefix="/api/v1/editor", tags=["editor"])


class SuggestRequest(BaseModel):
    text: str
    intent: str  # correct|rewrite|tone|continue
    target_tone: Optional[str] = None  # formal, friendly, concise, motivational, etc.


def _build_prompt(req: SuggestRequest) -> str:
    if req.intent == "correct":
        return (
            "Türkçe yazım ve dilbilgisi düzeltmesi yap. Anlamı koru, gereksiz değişiklik yapma.\n"
            "Sadece düzeltilmiş metni döndür.\n\n" + req.text
        )
    if req.intent == "rewrite":
        return (
            "Metni daha akıcı ve net olacak şekilde yeniden yaz. Anlamı koru.\n"
            "Sadece yeniden yazılmış metni döndür.\n\n" + req.text
        )
    if req.intent == "tone":
        tone = req.target_tone or "nazik ve profesyonel"
        return (
            f"Metni şu tona uyarlayarak yeniden yaz: {tone}. Anlamı koru.\n"
            "Sadece dönüştürülmüş metni döndür.\n\n" + req.text
        )
    if req.intent == "continue":
        return (
            "Aşağıdaki metni aynı üslupta 1-2 paragraf mantıklı şekilde devam ettir.\n"
            "Sadece devam metnini döndür.\n\n" + req.text
        )
    return "Bu metni daha iyi hale getir: " + req.text


@router.post("/suggest", response_model=dict)
async def suggest(req: SuggestRequest):
    try:
        provider = OpenAILLMProvider()
        prompt = _build_prompt(req)
        text = provider.chat_text(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful Turkish writing assistant."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.2,
            max_tokens=400,
        )
        return {"success": True, "suggestion": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Suggestion failed: {str(e)}")


