# 🚀 MemoryMap - Kodlama ve AI Entegrasyonu Kurulum Rehberi

## 1. GitHub Repository Kurulumu

### Adım 1: Repository Oluşturma
```bash
# Yerel proje klasörünüzde
git init
git add .
git commit -m "Initial commit: MemoryMap project documentation and setup"
```

### Adım 2: GitHub'da Repository Oluşturma
- GitHub.com'da yeni repository oluşturun: `memorymap-app`
- Repository'yi public yapın
- README, .gitignore ve lisans dosyası ekleyin

### Adım 3: Yerel Repository'yi GitHub'a Bağlama
```bash
git remote add origin https://github.com/[kullanıcı-adınız]/memorymap-app.git
git branch -M main
git push -u origin main
```

## 2. Proje Yapısı Oluşturma

### Klasör Yapısı
```
memorymap-app/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── requirements.txt
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── README.md
├── features/
│   ├── emotion-analysis/
│   ├── location-extraction/
│   └── image-generation/
├── docs/
│   ├── user-flow.md
│   ├── tech-stack.md
│   ├── idea.md
│   └── task-list.md
└── README.md
```

## 3. İlk Özellik: Duygu Analizi API'si

### Backend Kurulumu (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install fastapi uvicorn transformers torch
```

### features/emotion-analysis/ Klasörü Oluşturma
```python
# backend/app/services/emotion_analysis.py
from transformers import pipeline
import logging

class EmotionAnalysisService:
    def __init__(self):
        self.sentiment_analyzer = pipeline(
            "sentiment-analysis",
            model="distilbert-base-uncased-finetuned-sst-2-english"
        )
    
    def analyze_emotion(self, text: str) -> dict:
        try:
            result = self.sentiment_analyzer(text)
            return {
                "emotion": result[0]["label"],
                "confidence": result[0]["score"],
                "text": text
            }
        except Exception as e:
            logging.error(f"Emotion analysis error: {e}")
            return {"error": "Analysis failed"}
```

### API Endpoint Oluşturma
```python
# backend/app/routes/emotion.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.emotion_analysis import EmotionAnalysisService

router = APIRouter()
emotion_service = EmotionAnalysisService()

class TextInput(BaseModel):
    text: str

@router.post("/analyze-emotion")
async def analyze_emotion(input_data: TextInput):
    try:
        result = emotion_service.analyze_emotion(input_data.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## 4. README.md Güncelleme

### Ana README.md
```markdown
# 🗺️ MemoryMap
## Günlükten Anı Haritası Oluşturan Yapay Zekâ Uygulaması

MemoryMap, kullanıcıların günlük deneyimlerini yapay zekâ ile analiz ederek duygu durumları, ziyaret edilen mekânlar ve AI destekli görsellerle zenginleştiren yenilikçi bir dijital platformdur.

## 🚀 Hızlı Başlangıç

### Backend Kurulumu
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Kurulumu
```bash
cd frontend
npm install
npm start
```

## 📁 Proje Yapısı

- `backend/`: FastAPI tabanlı API
- `frontend/`: React.js kullanıcı arayüzü
- `features/`: AI özellikleri ve modüller
- `docs/`: Proje dokümantasyonu

## 🔧 İlk Özellik: Duygu Analizi

API endpoint: `POST /api/v1/emotion/analyze-emotion`

Örnek kullanım:
```bash
curl -X POST "http://localhost:8000/api/v1/emotion/analyze-emotion" \
     -H "Content-Type: application/json" \
     -d '{"text": "Bugün harika bir gün geçirdim!"}'
```

## 📚 Dokümantasyon

- [Kullanıcı Akışı](docs/user-flow.md)
- [Teknoloji Stack](docs/tech-stack.md)
- [Proje Fikri](docs/idea.md)
- [Görev Listesi](docs/task-list.md)
```

## 5. Test ve Doğrulama

### API Testi
```bash
# Backend'i başlat
cd backend
uvicorn app.main:app --reload

# Test isteği gönder
curl -X POST "http://localhost:8000/api/v1/emotion/analyze-emotion" \
     -H "Content-Type: application/json" \
     -d '{"text": "Bugün çok mutluyum!"}'
```

### Beklenen Çıktı
```json
{
  "emotion": "POSITIVE",
  "confidence": 0.9876,
  "text": "Bugün çok mutluyum!"
}
```

## 6. GitHub'a Push

```bash
git add .
git commit -m "Add MemoryMap emotion analysis feature with FastAPI and HuggingFace"
git push origin main
```

## ✅ Kontrol Listesi

- [ ] GitHub repository oluşturuldu (memorymap-app)
- [ ] Proje yapısı kuruldu
- [ ] Backend FastAPI kurulumu tamamlandı
- [ ] Duygu analizi özelliği çalışıyor
- [ ] README.md MemoryMap ismiyle güncellendi
- [ ] Kod GitHub'a push edildi
- [ ] API test edildi ve çalışıyor

## 🎯 Sonraki Adımlar

1. **Mekân Çıkarımı Özelliği**: spaCy NER entegrasyonu
2. **Görsel Üretimi**: Stable Diffusion entegrasyonu
3. **Frontend Geliştirme**: React.js ile kullanıcı arayüzü
4. **Veritabanı Entegrasyonu**: Supabase kurulumu

## 🗺️ MemoryMap - Anılarınızı harita üzerinde keşfedin! ✨ 