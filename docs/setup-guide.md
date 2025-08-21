# 🚀 MemoryMap Development Setup Guide

## Prerequisites

### System Requirements
- **Python 3.9+** (for backend)
- **Node.js 16+** (for frontend)  
- **PostgreSQL 12+** (database)
- **Git** (version control)

### Required Accounts
- **Firebase Project** (Storage + Authentication)
- **Supabase Account** (PostgreSQL database)
- **OpenAI API Key** (optional, for GPT-4 features)
- **Google Cloud Account** (optional, for Gemini features)

---

## 🔧 Backend Setup

### 1. Environment Setup
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux  
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

### 3. Environment Variables
Create `.env` file in `backend/` directory:

```env
# Database Configuration
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=memorymap
POSTGRES_HOST=your_host
POSTGRES_PORT=5432

# Security
SECRET_KEY=your_super_secret_key_here
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# Firebase Configuration
FIREBASE_CREDENTIALS=path/to/serviceAccount.json
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# AI Services (Optional)
OPENAI_API_KEY=your_openai_key
GOOGLE_API_KEY=your_gemini_key
HUGGINGFACE_API_TOKEN=your_hf_token

# External Services
FAL_API_KEY=your_fal_key
STABILITY_API_KEY=your_stability_key
```

### 4. Database Setup
```bash
# Using Supabase (recommended)
# 1. Create project at supabase.com
# 2. Get connection details from dashboard
# 3. Update .env with your credentials

# Or local PostgreSQL
createdb memorymap
```

### 5. Start Backend
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

---

## 🎨 Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Variables  
Create `.env` file in `frontend/` directory:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Start Frontend
```bash
npm start
```

Frontend will be available at: `http://localhost:3000`

---

## 🔥 Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project
3. Enable Authentication, Firestore, and Storage

### 2. Generate Service Account
1. Go to Project Settings → Service Accounts
2. Generate new private key
3. Download JSON file
4. Place in `backend/` directory
5. Update `FIREBASE_CREDENTIALS` path in `.env`

### 3. Configure Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🗄️ Database Schema

The application will automatically create required tables on first run. Key tables include:

- `users` - User authentication and profiles
- `diary_entries` - Main diary content and metadata  
- `emotions` - AI emotion analysis results
- `locations` - Extracted and geocoded places
- `generated_images` - AI-generated visual metadata
- `coaching_sessions` - Personal development conversations

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 🚀 Production Deployment

### Backend (Render.com)
1. Connect GitHub repository
2. Set environment variables in Render dashboard
3. Use `render.yaml` configuration
4. Deploy with: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel)
1. Connect GitHub repository  
2. Set environment variables in Vercel dashboard
3. Use `vercel.json` configuration
4. Automatic deployment on push

---

## 🔍 Troubleshooting

### Common Issues

**Backend won't start:**
- Check Python version (3.9+)
- Verify all environment variables are set
- Ensure PostgreSQL is running and accessible

**Database connection errors:**
- Verify database credentials
- Check network connectivity to database
- Ensure database exists and user has permissions

**AI models not working:**
- Check API keys are valid
- Verify HuggingFace models are downloading
- Ensure sufficient disk space for model cache

**Frontend build errors:**
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

### Performance Optimization

**Backend:**
- Enable Redis caching for frequently accessed data
- Use connection pooling for database
- Implement request rate limiting

**Frontend:**
- Enable code splitting for large components
- Optimize image loading and caching
- Use React.memo for expensive components

---

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React.js Documentation](https://reactjs.org/docs/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [HuggingFace Transformers](https://huggingface.co/docs/transformers)

---

**Need Help?** Check the GitHub issues or create a new one for specific problems.