# 🗺️ MemoryMap
## Günlükten Anı Haritası Oluşturan Yapay Zekâ Uygulaması

MemoryMap, kullanıcıların günlük deneyimlerini yapay zekâ ile analiz ederek duygu durumları, ziyaret edilen mekânlar ve AI destekli görsellerle zenginleştiren yenilikçi bir dijital platformdur.

## ✨ Özellikler

- 🤖 **AI Duygu Analizi**: HuggingFace ile günlük metinlerinizin duygu analizi
- 🗺️ **Anı Haritalama**: Ziyaret ettiğiniz yerleri OpenStreetMap üzerinde görselleştirme
- 🎨 **AI Görsel Üretimi**: Stable Diffusion ile anılarınıza özel görseller
- 🧠 **Kişisel Gelişim Koçluğu**: GPT-4 destekli reflektif sorular ve öneriler
- 📱 **Çoklu Platform**: Web ve mobil uygulama desteği

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

```
memorymap/
├── backend/          # FastAPI tabanlı API
├── frontend/         # React.js kullanıcı arayüzü
├── features/         # AI özellikleri ve modüller
│   ├── emotion-analysis/
│   ├── location-extraction/
│   └── image-generation/
└── docs/            # Proje dokümantasyonu
```

## 🔧 İlk Özellik: Duygu Analizi

API endpoint: `POST /api/v1/emotion/analyze-emotion`

Örnek kullanım:
```bash
curl -X POST "http://localhost:8000/api/v1/emotion/analyze-emotion" \
     -H "Content-Type: application/json" \
     -d '{"text": "Bugün harika bir gün geçirdim!"}'
```

Beklenen çıktı:
```json
{
  "emotion": "POSITIVE",
  "confidence": 0.9876,
  "text": "Bugün harika bir gün geçirdim!"
}
```

## 🛠️ Teknolojiler

- **Backend**: FastAPI, Python
- **Frontend**: React.js, React Native
- **AI Modelleri**: HuggingFace, spaCy, Stable Diffusion, GPT-4
- **Veritabanı**: Supabase (PostgreSQL)
- **Harita**: Leaflet.js, OpenStreetMap
- **Medya**: Firebase Storage
- **Bildirimler**: Firebase Cloud Messaging

## 📚 Dokümantasyon

- [Kullanıcı Akışı](docs/user-flow.md)
- [Teknoloji Stack](docs/tech-stack.md)
- [Proje Fikri](docs/idea.md)
- [Görev Listesi](docs/task-list.md)
- [Kurulum Rehberi](docs/setup-guide.md)

## 🎯 Hedefler

- 6 ay içerisinde 5.000+ aktif kullanıcı
- %80+ doğrulukla duygu ve mekân analizi
- 1.000+ kişiselleştirilmiş AI görseli
- %99.9 uptime ile kesintisiz hizmet

## 🤝 Katkıda Bulunma

1. Repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız.

## 📞 İletişim

- **Geliştirici**: Zeynep Yiğit
- **Proje**: MemoryMap - AI Destekli Günlük ve Anı Haritalama Uygulaması

---

**MemoryMap** - Anılarınızı harita üzerinde keşfedin! 🗺️✨ 