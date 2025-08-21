import os
from typing import Dict, Any
import requests


class StabilityImageProvider:
    def __init__(self, api_key: str | None = None):
        self.api_key = api_key or os.getenv("STABILITY_API_KEY", "")
        if not self.api_key:
            raise ValueError("STABILITY_API_KEY is required for Stability image provider")
        # v1 text-to-image endpoint (compatible/stable)
        self.url = "https://api.stability.ai/v1/generation/stable-diffusion-v1-5/text-to-image"

    def generate(self, prompt: str, width: int = 768, height: int = 512, steps: int = 30) -> Dict[str, Any]:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        payload = {
            "text_prompts": [{"text": prompt}],
            "cfg_scale": 7,
            "clip_guidance_preset": "FAST_BLUE",
            "height": height,
            "width": width,
            "samples": 1,
            "steps": steps,
        }
        resp = requests.post(self.url, headers=headers, json=payload, timeout=120)
        if resp.status_code != 200:
            return {"success": False, "error": f"{resp.status_code}: {resp.text}"}
        data = resp.json()
        try:
            b64 = data["artifacts"][0]["base64"]
            return {"success": True, "data": {"image_base64": b64}}
        except Exception:
            return {"success": False, "error": "Invalid response from Stability API"}


