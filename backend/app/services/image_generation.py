import requests
import io
import base64
from PIL import Image
import os

# HuggingFace API ayarları
HUGGINGFACE_API_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN", "")
STABLE_DIFFUSION_MODEL = "stabilityai/stable-diffusion-2-1"

def generate_image_from_prompt(prompt: str, width: int = 512, height: int = 512):
    """
    HuggingFace Inference API kullanarak Stable Diffusion ile görsel üretir
    """
    if not HUGGINGFACE_API_TOKEN:
        raise ValueError("HUGGINGFACE_API_TOKEN environment variable is required")
    
    headers = {
        "Authorization": f"Bearer {HUGGINGFACE_API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "inputs": prompt,
        "parameters": {
            "width": width,
            "height": height,
            "num_inference_steps": 20,
            "guidance_scale": 7.5
        }
    }
    
    try:
        response = requests.post(
            f"https://api-inference.huggingface.co/models/{STABLE_DIFFUSION_MODEL}",
            headers=headers,
            json=payload,
            timeout=60
        )
        
        if response.status_code == 200:
            # Görsel bytes olarak döner
            image_bytes = response.content
            
            # Base64'e çevir
            image_base64 = base64.b64encode(image_bytes).decode('utf-8')
            
            return {
                "success": True,
                "image_base64": image_base64,
                "image_bytes": image_bytes,
                "prompt": prompt
            }
        else:
            return {
                "success": False,
                "error": f"API Error: {response.status_code} - {response.text}"
            }
            
    except Exception as e:
        return {
            "success": False,
            "error": f"Generation failed: {str(e)}"
        }

def create_prompt_from_diary_entry(diary_text: str, emotion: str = None, locations: list = None):
    """
    Günlük girdisinden görsel üretimi için prompt oluşturur
    """
    base_prompt = f"A beautiful artistic illustration inspired by: {diary_text[:200]}"
    
    # Duygu durumuna göre stil ekle
    if emotion == "POSITIVE":
        base_prompt += ", bright colors, cheerful atmosphere, warm lighting"
    elif emotion == "NEGATIVE":
        base_prompt += ", moody atmosphere, dramatic lighting, contemplative mood"
    else:
        base_prompt += ", peaceful atmosphere, natural lighting"
    
    # Lokasyon varsa ekle
    if locations and len(locations) > 0:
        location_str = ", ".join(locations[:2])  # İlk 2 lokasyonu al
        base_prompt += f", set in {location_str}"
    
    # Stil ekleri
    base_prompt += ", digital art, high quality, detailed, artistic"
    
    return base_prompt 