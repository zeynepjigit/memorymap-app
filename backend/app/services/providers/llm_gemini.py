import os
import json
from typing import Any, Dict, List, Optional

try:
    import google.generativeai as genai
except Exception:  # pragma: no cover
    genai = None  # type: ignore


class GeminiLLMProvider:
    """Light wrapper around Google Gemini Chat Completions for text and JSON responses."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY", "")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY is required for Gemini provider")
        if genai is None:
            raise RuntimeError("google-generativeai package is not available")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def chat_text(
        self,
        messages: List[Dict[str, str]],
        model: str = "gemini-1.5-flash",
        temperature: float = 0.2,
        max_tokens: int = 600,
    ) -> str:
        try:
            # Convert OpenAI format to Gemini format
            gemini_messages = []
            for msg in messages:
                if msg.get("role") == "system":
                    # Gemini doesn't have system messages, so we'll prepend to user message
                    continue
                elif msg.get("role") == "user":
                    gemini_messages.append(msg.get("content", ""))
                elif msg.get("role") == "assistant":
                    # For assistant messages, we'll handle them differently
                    continue
            
            # Combine system message with first user message if exists
            system_content = ""
            for msg in messages:
                if msg.get("role") == "system":
                    system_content = msg.get("content", "")
                    break
            
            if system_content and gemini_messages:
                gemini_messages[0] = f"{system_content}\n\n{gemini_messages[0]}"
            
            # Generate response
            response = self.model.generate_content(
                gemini_messages[-1] if gemini_messages else "Hello",
                generation_config=genai.types.GenerationConfig(
                    temperature=temperature,
                    max_output_tokens=max_tokens,
                )
            )
            
            return response.text or ""
            
        except Exception as e:
            raise RuntimeError(f"Gemini chat failed: {e}")

    def chat_json(
        self,
        messages: List[Dict[str, str]],
        schema: Optional[Dict[str, Any]] = None,
        model: str = "gemini-1.5-flash",
        temperature: float = 0.2,
        max_tokens: int = 800,
    ) -> Dict[str, Any]:
        try:
            # Get text response first
            text_response = self.chat_text(messages, model, temperature, max_tokens)
            
            # Try to parse as JSON
            try:
                return json.loads(text_response)
            except Exception:
                # Fallback: return raw string in a wrapper
                return {"raw": text_response}
                
        except Exception as e:
            raise RuntimeError(f"Gemini JSON chat failed: {e}")
