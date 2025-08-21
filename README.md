# 🗺️ MemoryMap

[🔗 GitHub Repository](https://github.com/zeynepjigit/memorymap-app)

## AI-Powered Diary & Memory Mapping Application

MemoryMap is an innovative digital platform that transforms your daily experiences into meaningful insights. Using advanced AI technologies, it analyzes your diary entries to extract emotional states, locations, and generates personalized visuals while providing intelligent coaching for personal development.

---

## ✨ Key Features

### 🤖 AI-Powered Analysis
- **Emotion Analysis:** Advanced sentiment analysis using HuggingFace Transformers
- **Location Extraction:** Intelligent place detection with spaCy NER models
- **Text Analytics:** Comprehensive text processing and insights generation
- **Explainable AI:** Transparent AI decisions with detailed explanations

### 🗺️ Memory Visualization
- **Interactive Maps:** Visualize your memories on dynamic maps using Leaflet.js
- **Emotional Mapping:** Color-coded emotional states across locations
- **Memory Timeline:** Chronological view of your experiences
- **Location Insights:** Detailed analytics about visited places

### 🎨 AI Visual Generation
- **Multiple AI Providers:** Stable Diffusion, FAL.ai, Google Gemini integration
- **Memory-Specific Images:** Generate visuals that capture your experiences
- **Gallery Management:** Organize and manage AI-generated artwork
- **Custom Prompts:** Advanced prompt engineering for better results

### 🧠 Personal Development Coaching
- **RAG-Powered Coaching:** Retrieval-Augmented Generation for personalized advice
- **Reflective Questions:** AI-generated questions based on your entries
- **Progress Tracking:** Monitor your emotional and personal growth
- **Multiple LLM Support:** OpenAI GPT and Google Gemini integration

### 📱 User Experience
- **Responsive Design:** Beautiful UI that works on all devices
- **Real-time Updates:** Live data synchronization
- **Secure Authentication:** JWT-based user management
- **Firebase Integration:** Cloud storage and real-time database

### 📊 Analytics & Insights
- **Emotional Trends:** Track your mood patterns over time
- **Usage Analytics:** Detailed statistics about your diary habits
- **Model Performance:** AI accuracy tracking and optimization
- **Personal Dashboard:** Comprehensive overview of your journey

### 🔔 Smart Notifications
- **Personalized Reminders:** AI-generated motivational messages
- **Firebase Cloud Messaging:** Cross-platform push notifications
- **Smart Scheduling:** Context-aware notification timing

---

## 🚀 Quick Start

### Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn app.main:app --reload
```

### Frontend Setup (React.js)
```bash
cd frontend
npm install
npm start
```
The app will open at http://localhost:3000

---

## 🔐 Environment Variables

Backend (.env)
```env
SECRET_KEY=change_me
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=memorymap
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Optional / Open-source AI
HUGGINGFACE_API_TOKEN=

# Firebase
FIREBASE_CREDENTIALS={...json...}    # or a file path
FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
```

Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_FIREBASE_MEASUREMENT_ID=
```

Environment variable names match `vercel.json` and `render.yaml` for deployment.

---

## 📁 Project Structure
```
AIFD- Project/
├── backend/                          # FastAPI Backend
│   ├── app/
│   │   ├── main.py                  # Application entry point
│   │   ├── routes/                  # API endpoints
│   │   │   ├── auth.py             # Authentication routes
│   │   │   ├── diary.py            # Diary CRUD operations
│   │   │   ├── emotion.py          # AI analysis endpoints
│   │   │   ├── coaching.py         # RAG coaching system
│   │   │   └── profile.py          # User profile management
│   │   ├── services/               # Business logic
│   │   │   ├── emotion_analysis.py # HuggingFace emotion models
│   │   │   ├── location_extraction.py # spaCy NER for locations
│   │   │   ├── rag_coaching.py     # RAG implementation
│   │   │   ├── firebase.py         # Firebase integration
│   │   │   ├── analytics_backend.py # Usage tracking
│   │   │   └── providers/          # AI model providers
│   │   │       ├── llm_openai.py   # OpenAI GPT integration
│   │   │       ├── llm_gemini.py   # Google Gemini integration
│   │   │       └── images_*.py     # Image generation providers
│   │   ├── models/                 # Pydantic data models
│   │   ├── utils/                  # Helper utilities
│   │   └── middleware/             # Security & rate limiting
│   ├── tests/                      # Backend tests
│   └── requirements.txt            # Python dependencies
│
├── frontend/                         # React.js Frontend
│   ├── src/
│   │   ├── pages/                  # Main application pages
│   │   │   ├── Dashboard.js        # Main user dashboard
│   │   │   ├── DiaryEntry.js       # Diary creation/editing
│   │   │   ├── EmotionalMap.js     # Interactive emotion map
│   │   │   ├── Gallery.js          # AI-generated images
│   │   │   ├── CoachingDashboard.js # AI coaching interface
│   │   │   └── Quotes.js           # Motivational content
│   │   ├── components/             # Reusable UI components
│   │   ├── services/               # API integration
│   │   └── utils/                  # Frontend utilities
│   └── package.json                # Node.js dependencies
│
├── docs/                            # Documentation
│   ├── README.md                   # Project overview
│   ├── tech-stack.md              # Technology details
│   ├── user-flow.md               # User journey documentation
│   └── setup-guide.md             # Development setup
│
├── render.yaml                      # Backend deployment config
├── vercel.json                      # Frontend deployment config
└── README.md                        # Main project documentation
```

---

## ⚙️ How It Works
1. **User registers/logs in** (JWT-based authentication)
2. **Creates a diary entry** (text input)
3. **AI analyzes the text** for emotions and extracts locations
4. **AI optionally generates a visual** for the memory
5. **Memories are mapped** on an interactive map
6. **User receives coaching** and analytics based on their entries
7. **Notifications** keep users engaged and motivated

---

## 📖 API Overview

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | User registration with email/password |
| POST | `/auth/login` | User authentication and JWT token generation |
| GET | `/auth/me` | Get current user profile information |

### Diary Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/diary/` | Create new diary entry with AI analysis |
| GET | `/api/v1/diary/` | Retrieve diary entries with filtering |
| PUT | `/api/v1/diary/{id}` | Update existing diary entry |
| DELETE | `/api/v1/diary/{id}` | Delete diary entry and associated data |

### AI Analysis Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/emotion/analyze` | Advanced emotion analysis with confidence scores |
| POST | `/emotion/location/extract` | Extract and geocode locations from text |
| POST | `/emotion/coaching/questions` | Generate personalized reflective questions |
| POST | `/emotion/coaching/advice` | Get AI-powered personal development advice |

### Visual Generation
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/emotion/generate-image` | Create AI images using multiple providers |
| GET | `/emotion/images` | List user's generated images |
| DELETE | `/emotion/images/{id}` | Delete generated image |

### Analytics & Insights
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/emotion/insights` | Get emotional insights and trends |
| GET | `/analytics/dashboard` | Comprehensive user analytics |
| POST | `/notifications/send` | Send personalized notifications |

### RAG Coaching System
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/coaching/add-entry` | Add diary entry to RAG knowledge base |
| POST | `/coaching/query` | Query personal memory database |
| POST | `/coaching/advice` | Get context-aware coaching advice |

**📋 Complete API Documentation:** Visit `/docs` when running the backend for interactive Swagger documentation.

---

## 🧪 Testing

### Backend
```bash
cd backend
pytest -q
```

### Frontend
```bash
cd frontend
npm test
```

---

## ☁️ Deployment
- **Backend (Render):** See `render.yaml`. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT` (health check: `/health`)
- **Frontend (Vercel):** See `vercel.json` for static build routing and headers. Build with `npm run build` and define env vars in Vercel.

---

## 🛡️ Security & Best Practices
- Do not commit secrets (e.g., Firebase service accounts); protect via `.gitignore` and environment variables.
- Use HTTPS in production.
- Prefer open-source models/libraries; avoid paid/proprietary services.

---

## 🧰 Tech Stack

### Backend Architecture
- **Framework:** FastAPI with async/await support
- **Language:** Python 3.9+
- **Database:** PostgreSQL with SQLAlchemy ORM
- **Authentication:** JWT tokens with secure middleware
- **Rate Limiting:** SlowAPI for API protection
- **Cloud Services:** Firebase Admin SDK, Firestore

### AI & Machine Learning
- **NLP Models:** HuggingFace Transformers, spaCy NER
- **Embeddings:** sentence-transformers, OpenAI embeddings
- **Vector Database:** ChromaDB for RAG implementation
- **Image Generation:** Stable Diffusion, FAL.ai, Google Gemini
- **LLM Integration:** OpenAI GPT-4, Google Gemini Pro
- **RAG Framework:** Custom implementation with LangChain Community

### Frontend Technology
- **Framework:** React.js 18+ with Hooks
- **Routing:** React Router v6
- **Animations:** Framer Motion for smooth interactions
- **Maps:** Leaflet.js with React-Leaflet
- **HTTP Client:** Axios with interceptors
- **Styling:** Modern CSS with CSS Variables

### Database & Storage
- **Primary Database:** PostgreSQL (Supabase)
- **Vector Storage:** ChromaDB
- **File Storage:** Firebase Cloud Storage
- **Real-time Data:** Firestore for live updates

### DevOps & Deployment
- **Backend Hosting:** Render.com
- **Frontend Hosting:** Vercel
- **CI/CD:** GitHub Actions
- **Monitoring:** Custom analytics backend
- **Testing:** PyTest, React Testing Library

---

## 📚 Documentation
- `docs/user-flow.md`
- `docs/tech-stack.md`
- `docs/idea.md`
- `docs/task-list.md`
- `docs/setup-guide.md`

---

## 🧑‍💻 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m "Add new feature"`)
4. Push your branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

## 📄 License
This project is licensed under the MIT License. See the `LICENSE` file for details.

---

**MemoryMap** — Discover your memories on the map! 🗺️✨ 
