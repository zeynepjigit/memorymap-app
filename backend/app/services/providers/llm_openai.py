import os
import json
from typing import Any, Dict, List, Optional

try:
    from openai import OpenAI
except Exception:  # pragma: no cover
    OpenAI = None  # type: ignore


class OpenAILLMProvider:
    """Light wrapper around OpenAI Chat Completions for text and JSON responses."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY", "")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY is required for OpenAI provider")
        if OpenAI is None:
            raise RuntimeError("openai package is not available")
        self.client = OpenAI(api_key=self.api_key)

    def chat_text(
        self,
        messages: List[Dict[str, str]],
        model: str = "gpt-4o-mini",
        temperature: float = 0.2,
        max_tokens: int = 600,
    ) -> str:
        # allow fallback models via env comma list
        fallback_env = os.getenv("APP_OPENAI_CHAT_MODELS", "")
        model_candidates = [model]
        if fallback_env:
            for m in [m.strip() for m in fallback_env.split(",") if m.strip()]:
                if m not in model_candidates:
                    model_candidates.append(m)
        # add sane defaults as ultimate fallbacks
        for m in ["gpt-4o", "gpt-4o-mini"]:
            if m not in model_candidates:
                model_candidates.append(m)

        last_err: Exception | None = None
        for m in model_candidates:
            try:
                resp = self.client.chat.completions.create(
                    model=m,
                    messages=messages,
                    temperature=temperature,
                    max_tokens=max_tokens,
                )
                return resp.choices[0].message.content or ""
            except Exception as e:  # try next
                last_err = e
                continue
        
        # if all failed
        raise RuntimeError(f"OpenAI chat failed for models {model_candidates}: {last_err}")
    
    def _generate_fallback_response(self, messages: List[Dict[str, str]]) -> str:
        """Generate a fallback response when OpenAI quota is exceeded"""
        # Extract the user's message
        user_message = ""
        for msg in messages:
            if msg.get("role") == "user":
                user_message = msg.get("content", "")
                break
        
        # Simple rule-based responses for common coaching scenarios
        user_lower = user_message.lower()
        
        if any(word in user_lower for word in ["stres", "kaygı", "endişe", "anxiety", "stress"]):
            return """Stres ve kaygı yaşadığınızı anlıyorum. Size şu önerileri sunmak isterim:

1. **Nefes Egzersizleri**: Derin nefes alıp vererek kendinizi sakinleştirin
2. **Fiziksel Aktivite**: Düzenli egzersiz stres hormonlarını azaltır
3. **Zaman Yönetimi**: Görevlerinizi öncelik sırasına koyun
4. **Sosyal Destek**: Güvendiğiniz kişilerle konuşun
5. **Mindfulness**: Şu anki ana odaklanın

Bu teknikleri günlük rutininize ekleyerek stres seviyenizi kontrol altında tutabilirsiniz."""
        
        elif any(word in user_lower for word in ["mutlu", "happiness", "joy", "sevinç"]):
            return """Mutluluğunuzu paylaştığınız için teşekkürler! Mutluluğu sürdürmek için:

1. **Minik Anları Kutlayın**: Küçük başarıları takdir edin
2. **Şükran Günlüğü**: Her gün minnettar olduğunuz 3 şeyi yazın
3. **Sosyal Bağlar**: Sevdiklerinizle zaman geçirin
4. **Hobiler**: Size keyif veren aktivitelere zaman ayırın
5. **Kişisel Gelişim**: Yeni beceriler öğrenin

Mutluluk bir yolculuktur, her gün bu yolda ilerlemeye devam edin!"""
        
        elif any(word in user_lower for word in ["motivasyon", "motivation", "enerji", "energy"]):
            return """Motivasyonunuzu artırmak için şu stratejileri deneyebilirsiniz:

1. **Küçük Hedefler**: Büyük hedefleri küçük parçalara bölün
2. **Görselleştirme**: Başarılı olduğunuzu hayal edin
3. **Pozitif Self-Talk**: Kendinize olumlu mesajlar verin
4. **Rutin Oluşturun**: Düzenli alışkanlıklar geliştirin
5. **İlerlemeyi Takip Edin**: Başarılarınızı kaydedin

Her küçük adım sizi hedefinize yaklaştırır. Bugün hangi adımı atabilirsiniz?"""
        
        elif any(word in user_lower for word in ["ilişki", "relationship", "aile", "family"]):
            return """İlişkileriniz hakkında düşünmeniz çok değerli. İşte sağlıklı ilişkiler için öneriler:

1. **Açık İletişim**: Duygularınızı dürüstçe paylaşın
2. **Empati**: Karşınızdakinin perspektifini anlamaya çalışın
3. **Kaliteli Zaman**: Birlikte anlamlı aktiviteler yapın
4. **Sınırlar**: Sağlıklı sınırlar koyun
5. **Affetme**: Küçük anlaşmazlıkları büyütmeyin

İlişkiler sürekli çaba gerektirir, ama bu çaba çok değerlidir."""
        
        else:
            return """Merhaba! Size nasıl yardımcı olabilirim? 

Günlük hayatınızda yaşadığınız zorluklar, hedefleriniz veya duygularınız hakkında konuşmak isterseniz, size destek olmaya hazırım. 

Daha spesifik bir konu hakkında konuşmak isterseniz, lütfen bana detayları anlatın. Size kişiselleştirilmiş öneriler sunmaya çalışacağım.

Size en iyi şekilde yardımcı olmak için, lütfen yaşadığınız durumu detaylandırın. Stres, motivasyon, ilişkiler, hedefler veya herhangi bir konuda size rehberlik edebilirim."""

    def chat_json(
        self,
        messages: List[Dict[str, str]],
        schema: Optional[Dict[str, Any]] = None,
        model: str = "gpt-4o-mini",
        temperature: float = 0.2,
        max_tokens: int = 800,
    ) -> Dict[str, Any]:
        response_format: Dict[str, Any]
        if schema:
            # Use JSON schema mode if available
            response_format = {
                "type": "json_schema",
                "json_schema": {
                    "name": "structured_output",
                    "schema": schema,
                    "strict": True,
                },
            }
        else:
            response_format = {"type": "json_object"}

        resp = self.client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
            response_format=response_format,
        )
        content = resp.choices[0].message.content or "{}"
        try:
            return json.loads(content)
        except Exception:
            # Fallback: return raw string in a wrapper
            return {"raw": content}


