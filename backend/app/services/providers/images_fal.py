import os
from typing import Dict, Any
import requests


class FalImageProvider:
    def __init__(self, api_key: str | None = None, model: str | None = None):
        self.api_key = api_key or os.getenv("FAL_KEY", "")
        if not self.api_key:
            raise ValueError("FAL_KEY is required for Fal.ai image provider")
        # Default to Imagen4 preview; can be overridden with /fast or /ultra
        # Examples: fal-ai/imagen4/preview, fal-ai/imagen4/preview/fast, fal-ai/imagen4/preview/ultra
        self.model = model or os.getenv("FAL_MODEL", "fal-ai/imagen4/preview")
        # REST base used by fal.run proxy
        self.rest_base = os.getenv("FAL_REST_BASE", "https://fal.run")

    def generate(self, prompt: str, width: int = 768, height: int = 512, steps: int = 16) -> Dict[str, Any]:
        try:
            headers = {
                "Authorization": f"Key {self.api_key}",
                "Content-Type": "application/json",
            }
            # Imagen4 expects prompt and supports aspect_ratio, num_images, seed, output_format
            # Map width/height to a simplified aspect_ratio string like "3:2"
            def _aspect_ratio_str(w: int, h: int) -> str:
                try:
                    from math import gcd
                    g = gcd(max(w, 1), max(h, 1))
                    return f"{w // g}:{h // g}"
                except Exception:
                    return f"{w}:{h}"

            payload = {
                "prompt": prompt,
                "aspect_ratio": _aspect_ratio_str(max(int(width), 1), max(int(height), 1)),
                "num_images": 1,
            }

            # Submit request to queue for the selected model
            submit_url = f"{self.rest_base}/{self.model}"
            resp = requests.post(submit_url, json={"input": payload}, headers=headers, timeout=90)
            if resp.status_code != 200:
                return {"success": False, "error": f"{resp.status_code}: {resp.text}"}
            data = resp.json() or {}

            # Normalize common result shapes seen in fal models
            # Prefer direct image URL(s)
            image_url = None
            if isinstance(data, dict):
                # Many models return { images: [ { url } ] } or { image: { url } }
                images = data.get("images") or data.get("output") or []
                if isinstance(images, list) and len(images) > 0:
                    first = images[0]
                    if isinstance(first, dict):
                        image_url = first.get("url") or first.get("image_url")
                    elif isinstance(first, str):
                        image_url = first
                if not image_url:
                    # Some models respond with top-level url
                    image_url = data.get("url") or data.get("image_url")

            if image_url:
                return {"success": True, "data": {"image_url": image_url}}

            # Fallback: return raw data for troubleshooting
            return {"success": True, "data": data}
        except Exception as e:
            return {"success": False, "error": f"Fal image generation failed: {e}"}


