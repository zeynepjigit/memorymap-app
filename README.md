# 🗺️ MemoryMap

[🔗 GitHub Repository](https://github.com/zeynepjigit/memorymap-app)

## AI-Powered Diary & Memory Mapping Application

MemoryMap is a digital platform that analyzes users' daily experiences with artificial intelligence, enriching them with emotional states, visited places, and AI-generated visuals. The app helps users visualize their memories on a map, track their emotional journey, and receive personal development coaching powered by open‑source LLMs.

---

## ✨ Features
- **AI Emotion Analysis:** Analyze diary texts for emotions using HuggingFace models
- **Memory Mapping:** Visualize visited places on interactive maps (OpenStreetMap)
- **AI Visual Generation:** Create memory-specific images with Stable Diffusion (open source)
- **Personal Development Coaching:** Get reflective questions and suggestions powered by open‑source LLMs
- **Diary Management:** Create, update, and manage diary entries
- **User Authentication:** Secure registration, login, and JWT-based session management
- **Notifications:** Receive motivational and reminder push notifications
- **Analytics:** Track diary habits, emotion changes, and visited places

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
├── backend/                    # FastAPI-based API
│   ├── app/
│   │   ├── routes/             # auth, diary, diary_crud, emotion, location, coaching
│   │   ├── services/           # analytics_backend, emotion_analysis, rag_coaching, image_generation, location_extraction, firebase, firestore_service
│   │   ├── models/             # Pydantic models (user, diary, ...)
│   │   └── middleware/         # security headers, rate limiting
│   ├── requirements.txt
│   └── tests/
├── frontend/                   # React.js user interface
│   └── src/
├── docs/                       # Project documentation
├── render.yaml                 # Backend deployment (Render)
├── vercel.json                 # Frontend deployment (Vercel)
└── README.md                   # Project overview
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

## 📖 API Overview (Selected Endpoints)
| Method | Endpoint                         | Description                        |
|--------|-----------------------------------|------------------------------------|
| POST   | /auth/register                    | Register a new user                |
| POST   | /auth/login                       | User login                         |
| GET    | /auth/me                          | Get current user info              |
| POST   | /api/v1/diary/                    | Create a diary entry               |
| GET    | /api/v1/diary/                    | List diary entries                 |
| POST   | /api/v1/emotion/analyze           | Analyze emotion in text            |
| POST   | /api/v1/location/extract          | Extract locations from text        |
| POST   | /emotion/coaching/questions       | Get reflective questions           |
| POST   | /emotion/coaching/advice          | Get personal development advice    |

For more, see the FastAPI docs at `/docs` when the backend is running.

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
- **Backend:** FastAPI, Python, SQLAlchemy, Pydantic, SlowAPI (rate limiting), Firebase Admin SDK
- **AI:** HuggingFace Transformers, spaCy, sentence-transformers, ChromaDB, LangChain (community), Stable Diffusion
- **Frontend:** React.js, React Router, Leaflet.js/React-Leaflet, Axios, CSS
- **Database/Storage:** PostgreSQL (e.g., Supabase), Firebase Storage
- **Notifications:** Firebase Cloud Messaging
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
