# 🗺️ MemoryMap

## AI-Powered Diary & Memory Mapping Application

MemoryMap is an innovative digital platform that analyzes users' daily experiences with artificial intelligence, enriching them with emotional states, visited places, and AI-powered visuals. The app helps users visualize their memories on a map, track their emotional journey, and receive personal development coaching powered by GPT-4.

---

## ✨ Features
- **AI Emotion Analysis:** Analyze diary texts for emotions using HuggingFace models
- **Memory Mapping:** Visualize visited places on interactive maps (OpenStreetMap)
- **AI Visual Generation:** Create memory-specific images with Stable Diffusion
- **Personal Development Coaching:** Get reflective questions and suggestions powered by GPT-4
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
uvicorn app.main:app --reload
```

### Frontend Setup (React.js)
```bash
cd frontend
npm install
npm start
```
The app will open at [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure
```
AIFD- Project/
├── backend/         # FastAPI-based API
│   ├── app/
│   ├── requirements.txt
│   └── ...
├── frontend/        # React.js user interface
│   ├── src/
│   ├── package.json
│   └── ...
├── features/        # AI features and modules
├── docs/            # Project documentation
└── README.md        # Project overview
```

---

## 🛠️ Technologies
- **Backend:** FastAPI, Python, SQLAlchemy, HuggingFace Transformers, spaCy, Stable Diffusion, Firebase Admin SDK
- **Frontend:** React.js, React Router, Leaflet.js, Axios, CSS Modules
- **Database:** Supabase (PostgreSQL)
- **Media Storage:** Firebase Storage
- **Notifications:** Firebase Cloud Messaging
- **AI Models:** HuggingFace, GPT-4, Stable Diffusion

---

## ⚙️ How It Works
1. **User registers/logs in** (JWT-based authentication)
2. **Creates a diary entry** (text input)
3. **AI analyzes the text** for emotion and extracts locations
4. **AI generates a visual** for the memory (optional)
5. **Memories are mapped** on an interactive map
6. **User receives coaching** and analytics based on their entries
7. **Notifications** keep users engaged and motivated

---

## 📖 API Overview (Selected Endpoints)
| Method | Endpoint                        | Description                       |
|--------|----------------------------------|-----------------------------------|
| POST   | /auth/register                  | Register a new user               |
| POST   | /auth/login                     | User login                        |
| GET    | /auth/me                        | Get current user info             |
| POST   | /api/v1/diary/                  | Create a diary entry              |
| GET    | /api/v1/diary/                  | List diary entries                |
| POST   | /api/v1/emotion/analyze         | Analyze emotion in text           |
| POST   | /emotion/image/generate         | Generate image from diary entry   |
| POST   | /emotion/coaching/questions     | Get reflective questions          |
| POST   | /emotion/coaching/advice        | Get personal development advice   |

For more, see the FastAPI docs at `/docs` when the backend is running.

---

## 🧑‍💻 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push your branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

---

## 🔒 Security & Best Practices
- **Sensitive files** (such as `backend/firebase-service-account.json`) are excluded from version control via `.gitignore` and must NOT be pushed to GitHub.
- Use environment variables for API keys and secrets.
- All API traffic should be over HTTPS in production.

---

## 📚 Documentation
- [User Flow](docs/user-flow.md)
- [Technology Stack](docs/tech-stack.md)
- [Project Idea](docs/idea.md)
- [Task List](docs/task-list.md)
- [Setup Guide](docs/setup-guide.md)

---

## 📄 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**MemoryMap** - Discover your memories on the map! 🗺️✨ 