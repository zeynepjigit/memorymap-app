# Product Requirements Document (PRD)  
## AI-Powered Diary to Memory Map Application

---

## 1. Problem / Opportunity

### Detailed Product Description and In-Depth Problem Analysis

The AI-Powered Diary to Memory Map Application is an innovative digital platform that enriches users' daily life experiences not just as text, but multidimensionally with emotional states, visited places, AI-powered visuals, and personalized memory-driven insights.

Today's widespread traditional diary applications are text-based and cannot effectively support the emotional intensity, spatial relationships, reflective growth, and dream-based visualization of users' experiences. This creates a significant gap in terms of users' emotional awareness, memory retention, and self-development. Users mostly store their text entries with timestamps in plain lists, which leads to difficulties in contextualizing and visualizing past memories.

The project aims to solve this problem through **AI-based emotion analysis, RAG-enhanced reflective coaching, memory-context management (MCP), motivational notifications, and dream visualizations**, providing a comprehensive platform where users can track and explore memories with visual, emotional, and reflective context.

This innovative approach both supports individual mental health and personal growth, while creating a competitive advantage in the current market by enabling users to record, rediscover, and reflect on their memories in a multidimensional way.

---

## 2. Target Users & Use Cases

### Target User Profiles

- **Individual Diary Enthusiasts:** Users of all age groups who want to record experiences meaningfully and visually.  
- **Personal Development and Mental Health Enthusiasts:** Students, professionals, and consultees seeking reflective growth and emotional awareness.  
- **Travel and Exploration Enthusiasts:** Travelers who want to record trips with geospatial and emotional context.  
- **Technology & Data Enthusiasts:** Users who want insights from emotion-location-memory analyses.  
- **Creative & Dream-Oriented Users:** Users who want to visualize dreams and imaginative experiences.

### Core Use Cases

- Creating enriched memories from daily text entries through **automatic emotion and location extraction**.  
- Visualizing visited places and memories on **interactive maps**.  
- Generating **AI-powered original visuals** for diary content and dream visualization.  
- Providing **RAG-enhanced reflective questions** for personal growth.  
- Sending **motivational quote cards** and **memory-based notifications**, e.g., “How is the book you mentioned last week?”  
- Analyzing and reporting memories based on **date, location, and mood trends**.

---

## 3. Current State / User Journeys and Competition

Currently, diary and map applications are used separately. They lack integrated emotional context, AI-driven coaching, memory-based prompts, or dream visualization.  

Competitive products generally include text-based input with limited emotion analysis but lack **RAG integration, MCP, AI visuals, and context-aware reflective coaching**.  

Our project fills this gap with **AI-powered multidimensional journaling, emotional intelligence, and dynamic personal growth support**.

---

## 4. Proposed Solution / Elevator Pitch

The AI-Powered Diary to Memory Map Application is an innovative platform that:

- Enriches users' daily texts with **emotion and location extraction**.  
- Integrates memories with **interactive maps** and **AI-generated visuals**.  
- Provides **personalized coaching and motivational content** using RAG and GPT-4.  
- Visualizes **user dreams** in artistic and surreal imagery.  
- Sends **smart, context-aware notifications** based on memory and mood.

### 4 Core Values of MVP

1. **Emotion and Location Richness:** Contextualizing daily experiences with mood and geography.  
2. **AI-Powered Visual Experience:** Generating memory-specific and dream visuals.  
3. **Reflective Coaching & Personal Growth:** GPT-4 + RAG reflective questions.  
4. **Memory-Based Engagement:** Motivational cards and context-aware notifications.

---

## 5. Goals / Measurable Results

- Reach at least **5,000 active users** within 6 months.  
- Achieve **80%+ accuracy** in emotion and location extraction.  
- Generate at least **1,500 personalized visuals** (memories + dreams).  
- Increase user return rate by **25%** via push notifications.  
- Ensure **99.9% uptime** and **API latency under 500ms**.

---

## 6. MVP / Functional Requirements

### 6.1 User Management
- [P0] User registration, login, password reset, and profile management.  
- [P0] JWT-based secure session login and authorization.

### 6.2 Diary Entry and Management
- [P0] Multi-line text input interface.  
- [P0] Creating and editing timestamped diary entries.  
- [P1] Date and time display.  
- [P1] Mood tagging during entry.

### 6.3 Emotion and Location Analysis
- [P0] Emotion analysis with HuggingFace `distilbert-base-uncased-finetuned-sst-2-english`.  
- [P0] Location and place name extraction via spaCy / HuggingFace NER.  
- [P1] Conversion of locations to OpenStreetMap coordinates.

### 6.4 Map Visualization
- [P0] Interactive map markers with Leaflet.js.  
- [P1] Display related diary entry and AI visual on click.

### 6.5 Visual Generation
- [P0] AI-generated visuals for diary entries using Stable Diffusion.  
- [P1] AI dream visualization feature.  
- [P1] Gallery management for all visuals.

### 6.6 AI Coaching Module
- [P1] GPT-4 + RAG reflective question generation.  
- [P1] Motivational quote cards based on user mood.  
- [P2] Advanced personal development suggestions.

### 6.7 Notifications
- [P1] Memory-based reminders (e.g., follow-up on past entries).  
- [P1] Motivational notifications with daily quotes.  
- [P2] Context-aware prompts tailored to mood and history.

### 6.8 Telemetry and Analytics
- [P0] Monitor user activity and interaction metrics.  
- [P1] Track mood and memory trends.  
- [P2] Analyze dream visualization engagement.

---

## 7. System Architecture and Technology Choices

| Layer | Technology / Model | Description |
|-------|------------------|-------------|
| Frontend | React.js (Web), React Native (Mobile) | User interface and interactive experience. |
| Backend | FastAPI (Python) | REST API, business logic, AI integrations, RAG agent orchestration. |
| Database | Supabase (PostgreSQL) | Secure and scalable storage. |
| Vector Store | Pinecone / Weaviate | Embeddings for RAG and memory search. |
| Media Storage | Firebase Storage | Visual and media file management. |
| Emotion Analysis | HuggingFace DistilBERT | Text-based emotion extraction. |
| Location/Place Extraction | spaCy NER, HuggingFace NER | Extracting location names from text. |
| Visual Generation | Stable Diffusion | Memory and dream AI visual creation. |
| Coaching Module | GPT-4 + RAG | Reflective questions, motivational quotes, personal growth. |
| Notifications | Firebase Cloud Messaging | Push notification system. |

---

## 8. API Requirements (Example)

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | /api/v1/auth/register | New user registration |
| POST | /api/v1/auth/login | User login |
| GET | /api/v1/users/me | Logged-in user info |
| POST | /api/v1/entries | Create new diary entry |
| GET | /api/v1/entries | List user's diary entries |
| GET | /api/v1/entries/{id} | Specific diary entry details |
| POST | /api/v1/visuals | Generate AI visual for entry |
| POST | /api/v1/dreams | Generate dream visualization |
| POST | /api/v1/notifications | Create/manage notifications |

---

## 9. Non-Functional Requirements

- **Performance:** Page load < 2s; API response < 500ms (AI processing exception).  
- **Security:** HTTPS, JWT auth, OWASP compliance.  
- **Accessibility & Compatibility:** 99.9% uptime, modern browser & mobile support.  
- **Scalability:** Horizontal scaling, fault-tolerant architecture.

---

**Prepared by:** Zeynep Yiğit  
**Delivery Date:** Updated with RAG, MCP, motivational, memory & dream features
