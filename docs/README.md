# 🗺️ MemoryMap
## AI-Powered Diary to Memory Map Application

MemoryMap is an innovative digital platform that analyzes users' daily experiences with artificial intelligence, enriching them with emotional states, visited places, and AI-powered visuals.

## ✨ Features

- 🤖 **AI Emotion Analysis**: Emotion analysis of your diary texts with HuggingFace
- 🗺️ **Memory Mapping**: Visualizing the places you visit on OpenStreetMap
- 🎨 **AI Visual Generation**: Memory-specific visuals with Stable Diffusion
- 🧠 **Personal Development Coaching**: GPT-4 powered reflective questions and suggestions
- 📱 **Multi-Platform**: Web and mobile application support

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 📁 Project Structure

```
memorymap/
├── backend/          # FastAPI-based API
├── frontend/         # React.js user interface
├── features/         # AI features and modules
│   ├── emotion-analysis/
│   ├── location-extraction/
│   └── image-generation/
└── docs/            # Project documentation
```

## 🔧 First Feature: Emotion Analysis

API endpoint: `POST /api/v1/emotion/analyze-emotion`

Example usage:
```bash
curl -X POST "http://localhost:8000/api/v1/emotion/analyze-emotion" \
     -H "Content-Type: application/json" \
     -d '{"text": "I had a wonderful day today!"}'
```

Expected output:
```json
{
  "emotion": "POSITIVE",
  "confidence": 0.9876,
  "text": "I had a wonderful day today!"
}
```

## 🛠️ Technologies

- **Backend**: FastAPI, Python
- **Frontend**: React.js, React Native
- **AI Models**: HuggingFace, spaCy, Stable Diffusion, GPT-4
- **Database**: Supabase (PostgreSQL)
- **Maps**: Leaflet.js, OpenStreetMap
- **Media**: Firebase Storage
- **Notifications**: Firebase Cloud Messaging

## 📚 Documentation

- [User Flow](docs/user-flow.md)
- [Technology Stack](docs/tech-stack.md)
- [Project Idea](docs/idea.md)
- [Task List](docs/task-list.md)
- [Setup Guide](docs/setup-guide.md)

## 🎯 Goals

- 5,000+ active users within 6 months
- 80%+ accuracy in emotion and location analysis
- 1,000+ personalized AI visuals
- 99.9% uptime with uninterrupted service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push your branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Developer**: Zeynep Yiğit
- **Project**: MemoryMap - AI-Powered Diary and Memory Mapping Application

---

**MemoryMap** - Discover your memories on the map! 🗺️✨
