# 🗺️ MemoryMap Documentation
## AI-Powered Diary & Memory Mapping Application

MemoryMap is a comprehensive digital platform that transforms your daily experiences into meaningful insights through advanced AI technologies. The application provides intelligent analysis, visual generation, and personalized coaching to help users understand their emotional journey and personal growth.

## ✨ Current Features (Implemented)

### 🤖 Advanced AI Analysis
- **Multi-Model Emotion Analysis**: HuggingFace Transformers with confidence scoring
- **Intelligent Location Extraction**: spaCy NER with geocoding integration
- **Comprehensive Text Analytics**: Deep text processing and pattern recognition
- **Explainable AI**: Transparent decision-making with detailed explanations

### 🗺️ Interactive Memory Visualization  
- **Dynamic Maps**: Leaflet.js integration with OpenStreetMap
- **Emotional Mapping**: Color-coded visualization of emotional states by location
- **Memory Timeline**: Chronological exploration of experiences
- **Advanced Filtering**: Filter by emotion, date, location, and custom tags

### 🎨 Multi-Provider AI Image Generation
- **Stable Diffusion**: High-quality memory-specific image generation
- **FAL.ai Integration**: Fast and efficient AI image creation
- **Google Gemini Vision**: Advanced visual understanding and generation
- **Custom Prompt Engineering**: Optimized prompts for better visual results

### 🧠 RAG-Powered Personal Development
- **Context-Aware Coaching**: Retrieval-Augmented Generation for personalized advice
- **Memory-Based Insights**: AI coaching based on your personal history
- **Progress Tracking**: Monitor emotional and personal growth over time
- **Multi-LLM Support**: OpenAI GPT-4 and Google Gemini Pro integration

### 📊 Comprehensive Analytics
- **Emotional Trend Analysis**: Track mood patterns and changes
- **Usage Statistics**: Detailed insights into diary habits
- **Model Performance Tracking**: AI accuracy monitoring and optimization
- **Personal Growth Metrics**: Quantified self-improvement tracking

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
