# ✅ Task List  
## MemoryMap – AI-Powered Diary to Memory Map Application (MVP + Advanced Features)

---

## 🔧 Infrastructure & Basic System Setup
- `P0` Create project repository (Frontend / Backend)
- `P0` Supabase (PostgreSQL) configuration for user, diary, emotion, location, visual metadata
- `P0` Firebase project setup (Storage + Messaging)
- `P0` Vector database setup (Pinecone / Weaviate) for RAG and memory retrieval
- `P0` Basic backend infrastructure with FastAPI and JWT session system
- `P0` HTTPS, CORS, and basic security configuration
- `P1` CI/CD pipeline setup (GitHub Actions + Vercel / Render)
- `P1` Logging, monitoring, and error tracking infrastructure

---

## 👤 User Management
- `P0` User registration and login (API + UI)
- `P0` JWT-based authentication and session management
- `P0` Profile screen: view & edit (name, interests, mood tracking)
- `P1` Preference settings: notification frequency, visual style, coaching intensity
- `P2` Privacy & GDPR settings (data export/delete options)

---

## 📓 Diary Entry Management
- `P0` Create, edit, delete diary entries (text + timestamp)
- `P1` Multi-line text input with rich-text support
- `P1` Attach media (images, videos, audio)
- `P1` Automatic mood detection based on text input
- `P1` Link entries to previous memories (RAG retrieval)
- `P2` Auto-summarize past week/month entries

---

## 😄 Emotion and Location Analysis
- `P0` Emotion analysis API (HuggingFace DistilBERT)
- `P0` Location extraction (spaCy NER / HuggingFace NER)
- `P1` Convert location to OpenStreetMap coordinates
- `P1` Visualize emotion and location on map markers
- `P1` Track emotion trends over time (dashboard)
- `P2` Semantic similarity search for past memories (RAG integration)

---

## 🗺️ Map Visualization
- `P0` Map component integration (Leaflet.js + OpenStreetMap)
- `P1` Place marking and coordinate placement
- `P1` Show diary details when clicking on markers
- `P1` Filter by mood, location, date, or tags
- `P2` Visual clustering for densely visited areas
- `P2` Dream / visualization mapping

---

## 🖼️ Visual Generation System
- `P0` Stable Diffusion integration for diary content
- `P0` Prompt generation system from diary entries
- `P1` Upload generated visuals to Firebase Storage
- `P1` Visual gallery screen (delete/download/favorite)
- `P1` Dream visualization pipeline (RAG + creative prompts)
- `P2` Daily motivational / quote card generation based on mood
- `P2` User feedback loop to improve generated visuals

---

## 🤖 AI Coaching Module (GPT-4 + RAG + MCP)
- `P1` Generate reflective questions with GPT-4
- `P1` Track user responses and previous answers (MCP)
- `P2` Personalized development recommendations
- `P2` Context-aware follow-ups (e.g., “How is your book reading going?”)
- `P2` RAG-based memory retrieval for coaching questions
- `P2` Multi-step reasoning agents for personalized guidance

---

## 🔔 Notification System
- `P1` Firebase Cloud Messaging integration
- `P1` Prepare notification templates:
  - Daily motivational card
  - Memory reminder (RAG/MCP-based)
  - Dream reflection reminder
- `P1` Schedule notification sending (timed / triggered by user activity)
- `P2` Contextual notifications based on past entries and trends

---

## 📊 Telemetry and Analytics
- `P0` Setup user interaction and behavior metrics
- `P0` Firebase/Google Analytics integration
- `P1` Emotion and location trend dashboard
- `P1` Visual generation engagement tracking
- `P2` Coaching effectiveness analysis dashboard
- `P2` Dream visualization usage metrics

---

## 💻 Frontend Development (React.js / React Native)
- `P0` Registration/login/password reset screens
- `P0` Main screen: create diary, listing
- `P1` Map screen with markers and filters
- `P1` Visual gallery and detail view (view, download, favorite)
- `P1` Dream visualization screen
- `P1` GPT coaching session screen
- `P1` Profile & settings page
- `P2` Mood and trend visualization dashboard

---

## 🚀 Deployment and Testing
- `P0` Backend unit tests for API endpoints
- `P0` API security & error handling
- `P1` Model output accuracy tests (emotion, RAG, visual generation)
- `P1` CI/CD setup (GitHub Actions + deployment)
- `P1` Beta release to test group
- `P2` Stress/load testing with multiple users

---

## 📈 MVP Goal Tracking and Monitoring
- `P0` Track active users, retention, emotion-location analysis accuracy
- `P1` Collect user feedback via survey forms
- `P2` Measure GPT coaching impact on personal development
- `P2` Engagement metrics for dream visualization and motivational cards
