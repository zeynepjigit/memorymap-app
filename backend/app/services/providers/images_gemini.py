import os
from typing import Dict, Any

# New client (preferred for image gen)
try:  # pragma: no cover
    from google import genai as ggenai
    from google.genai import types as gtypes
except Exception:  # pragma: no cover
    ggenai = None  # type: ignore
    gtypes = None  # type: ignore

# We will not use the legacy google-generativeai path here to avoid API mismatches
genai = None  # type: ignore


class GeminiImageProvider:
    def __init__(self, api_key: str | None = None, model_name: str | None = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY", "")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY is required for Gemini image provider")
        if ggenai is None or gtypes is None:
            raise RuntimeError("google-genai package is required for Gemini image generation. Run: pip install google-genai")
        # Preferred: new client
        self.client = ggenai.Client(api_key=self.api_key)
        self.model = None
        self.model_name = model_name or "gemini-2.0-flash-preview-image-generation"
        # Prefer only image-capable Gemini models via public API
        self.candidate_models = [self.model_name]

    def generate(self, prompt: str, width: int = 768, height: int = 512, steps: int = 16) -> Dict[str, Any]:
        try:
            response = None
            size_hint = f" (arzu edilen boyut: {width}x{height})"
            last_error: Exception | None = None

            # Try candidates with new client
            errors_per_model = []
            for m in self.candidate_models:
                if not m:
                    continue
                try:
                    response = self.client.models.generate_content(
                        model=m,
                        contents=prompt + size_hint,
                        config=gtypes.GenerateContentConfig(
                            response_modalities=["IMAGE"],
                        ),
                    )
                    self.model_name = m
                    break
                except Exception as e:
                    last_error = e
                    errors_per_model.append({"model": m, "error": str(e)})
                    response = None

            # Try common structures to extract inline image bytes (new client)
            image_bytes = None

            # Preferred path: response.candidates[0].content.parts[*].inline_data.data
            try:
                candidates = getattr(response, "candidates", [])
                if candidates:
                    parts = getattr(candidates[0].content, "parts", [])
                    for part in parts:
                        inline = getattr(part, "inline_data", None)
                        if inline and getattr(inline, "data", None):
                            image_bytes = inline.data
                            break
            except Exception:
                pass

            if image_bytes:
                import base64

                b64 = base64.b64encode(image_bytes).decode("utf-8")
                return {"success": True, "data": {"image_base64": b64}}

            tried = ", ".join([m for m in self.candidate_models if m])
            err_detail = f"Gemini did not return image data; tried_models=[{tried}]"
            if errors_per_model:
                err_detail += f"; model_errors={errors_per_model}"
            return {"success": False, "error": err_detail}
        except Exception as e:
            return {"success": False, "error": f"Gemini image generation failed ({self.model_name}): {e}"}


