from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List

from ..utils.auth import get_current_user, CurrentUser
from ..services.rag_coaching import rag_coaching_service
from ..services.providers.llm_gemini import GeminiLLMProvider


router = APIRouter(prefix="/api/v1/coach", tags=["coach"])


class ChatRequest(BaseModel):
    message: str
    top_k: Optional[int] = 4


@router.post("/chat", response_model=dict)
async def coach_chat(req: ChatRequest, current_user: CurrentUser = Depends(get_current_user)):
    try:
        # Check if Gemini API key is available
        import os
        if not os.getenv("GEMINI_API_KEY"):
            raise HTTPException(
                status_code=500, 
                detail="Gemini API key is not configured. Please set GEMINI_API_KEY environment variable."
            )
        
        # Retrieve related diary entries for context
        try:
            related = rag_coaching_service.query_diary(req.message, top_k=req.top_k or 4, user_id=current_user.id)
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"Failed to query diary entries: {str(e)}"
            )

        # If no results available, try syncing Firestore diaries into vector DB and re-query
        try:
            no_results = not related.get("success") or not (related.get("results") or [])
            if no_results:
                rag_coaching_service.sync_user_diaries_from_firestore(user_id=current_user.id)
                related = rag_coaching_service.query_diary(req.message, top_k=req.top_k or 4, user_id=current_user.id)
        except Exception:
            # best-effort sync; continue with what we have
            pass
            
        context_snippets: List[str] = []
        if related.get("success"):
            for r in (related.get("results") or [])[: req.top_k or 4]:
                meta = r.get("metadata", {})
                context_snippets.append(
                    f"Tarih: {meta.get('date','')} | Duygu: {meta.get('emotion','')}\n{r.get('content','')[:500]}"
                )

        system = (
            "You are a thoughtful Turkish life coach. Give long, structured, actionable guidance. "
            "Use empathy, reference user's past diary context if relevant. Avoid clinical diagnoses."
        )
        user = f"Kullanıcı mesajı: {req.message}\n\nİlgili günlükler:\n\n" + "\n---\n".join(context_snippets)

        # Initialize Gemini provider
        try:
            llm = GeminiLLMProvider()
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"Failed to initialize Gemini provider: {str(e)}"
            )
            
        # Make LLM call
        try:
            answer = llm.chat_text(
                model="gemini-1.5-flash",
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
                temperature=0.6,
                max_tokens=900,
            )
        except Exception as e:
            raise HTTPException(
                status_code=502, 
                detail=f"Gemini API call failed: {str(e)}"
            )

        return {
            "success": True,
            "answer": answer,
            "sources": (related.get("results") or [])[: req.top_k or 4],
        }
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error in coach chat: {str(e)}")


