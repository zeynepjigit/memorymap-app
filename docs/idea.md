# Product Requirements Document (PRD)  
## AI-Powered Diary to Memory Map Application

---

## 1. Problem / Opportunity

### Detailed Product Description and In-Depth Problem Analysis

The AI-Powered Diary to Memory Map Application is an innovative digital platform that enriches users' daily life experiences not just as text, but multidimensionally with emotional states, visited places, and AI-powered visuals.

Today's widespread traditional diary applications are text-based and cannot effectively support the emotional intensity, spatial relationships, and personal development context of users' experiences. This creates a significant gap in terms of users' emotional awareness and memory retention of their experiences. Users mostly store their text entries with timestamps in plain lists, which leads to difficulties in contextualizing and visualizing past memories.

The project aims to solve this problem through AI-based emotion analysis, location extraction, and visual content generation, providing a comprehensive platform where users can track their memories on maps with visual and emotional context, while also contributing to their personal development through GPT-4 supported reflective questions.

This innovative approach both supports individual mental health and creates a competitive advantage in the current market by enabling users to record and discover their memories in a multidimensional way.

---

## 2. Target Users & Use Cases

### Target User Profiles

- **Individual Diary Enthusiasts:** Users of all age groups who want to record their lived experiences in a more meaningful, rich, and lasting way.
- **Personal Development and Mental Health Enthusiasts:** Students, professionals, and consultees who want to develop awareness by regularly tracking their emotions and improve their psychological health.
- **Travel and Exploration Enthusiasts:** Travelers and travel lovers who want to record their travel experiences in a spatial context.
- **Technology & Data Enthusiasts:** Advanced users who want to gain insights by performing emotion-location analyses on their own datasets.

### Core Use Cases

- Creating enriched memories from daily text entries through automatic emotion and location extraction.
- Visualizing visited places and memories on interactive maps based on OpenStreetMap.
- Generating AI-powered original visuals suitable for diary content and presenting them in gallery format.
- Providing reflective questions and motivational notifications to users through GPT-4 based personal development coaching module.
- Analyzing and reporting memories based on date and location to users.

---

## 3. Current State / User Journeys and Competition

Currently, digital diary applications (Day One, Journey, etc.) and map applications (Google Maps, Mapbox) are used separately. These applications do not handle the user experience holistically and do not allow for establishing emotion-location relationships. Additionally, AI-powered personal development coaching integration is rarely found.

Competitive products generally include text-based input and limited emotion analysis, but comprehensive visual generation and spatial integration are lacking. This limits users' personal data richness and interaction.

Our project aims to fill this gap with AI-based multidimensional data analysis and user experience.

---

## 4. Proposed Solution / Elevator Pitch

The AI-Powered Diary to Memory Map Application is an innovative platform that enriches users' daily texts with emotion and location extraction, integrates them with interactive maps and AI-powered original visuals, and provides personal development coaching.

### 3 Core Values of MVP

1. **Emotion and Location Richness:** Contextualizing daily experiences with mood and geographical context.
2. **AI-Powered Visual Experience:** Generating and storing memory-specific original visuals with artificial intelligence.
3. **Personal Development Coaching:** Increasing user awareness through GPT-4 based reflective questions.

---

## 5. Goals / Measurable Results

- Reach at least 5,000 active users within 6 months.
- Provide emotion and location extraction with over 80% accuracy in daily entries.
- Generate at least 1,000 personalized visuals with AI visual generation module.
- Increase user return rate by 20% through push notifications.
- Ensure 99.9% uptime for uninterrupted service.

---

## 6. MVP / Functional Requirements

### 6.1 User Management
- [P0] User registration, login, password reset, and profile management.
- [P0] JWT-based secure session login and authorization.

### 6.2 Diary Entry and Management
- [P0] Multi-line text input interface.
- [P0] Creating and editing timestamped diary entries.
- [P1] Date and time display in diary entries.

### 6.3 Emotion and Location Analysis
- [P0] Emotion analysis with HuggingFace `distilbert-base-uncased-finetuned-sst-2-english` model.
- [P0] Location and place name extraction with spaCy or HuggingFace NER models.
- [P1] Converting extracted locations to OpenStreetMap coordinates.

### 6.4 Map Visualization
- [P0] Marking visited places on OpenStreetMap using Leaflet.js.
- [P1] Showing related diary entry details by clicking on map markers.

### 6.5 Visual Generation
- [P0] Generating original visuals suitable for user input with Stable Diffusion.
- [P1] Saving and managing generated visuals in gallery.

### 6.6 AI Coaching Module
- [P1] GPT-4 based reflective question generation and presentation to users.
- [P2] Providing personal development suggestions and advanced analyses.

### 6.7 Notifications
- [P1] Scheduling and sending motivational and reminder push notifications with Firebase Cloud Messaging.

### 6.8 Telemetry and Analytics
- [P0] Monitoring user activities, collecting interaction metrics, and reporting.

---

## 7. System Architecture and Technology Choices

| Layer         | Technology / Model                                  | Description                                      |
|---------------|---------------------------------------------------|--------------------------------------------------|
| Frontend      | React.js (Web), React Native (Mobile)              | User interface and interactive experience.      |
| Backend       | FastAPI (Python)                                   | RESTful API, business logic, AI integrations.   |
| Database      | Supabase (PostgreSQL)                              | Secure and scalable data storage.               |
| Media Storage | Firebase Storage                                   | Visual and media file management.               |
| Emotion Analysis | HuggingFace Transformers (DistilBERT)           | Text-based emotion extraction.                   |
| Location/Place Extraction | spaCy NER, HuggingFace NER models        | Extracting location and place names from text.  |
| Visual Generation | Stable Diffusion                               | AI-powered original visual creation.             |
| Coaching Module | GPT-4 (OpenAI / Alternative Free Model phi-2)   | Reflective questions and personal development content.|
| Notifications | Firebase Cloud Messaging                           | Push notification service.                       |

---

## 8. API Requirements (Example)

| Method | Endpoint                   | Description                              |
|--------|----------------------------|------------------------------------------|
| POST   | /api/v1/auth/register      | New user registration                    |
| POST   | /api/v1/auth/login         | User login                              |
| GET    | /api/v1/users/me           | Logged-in user information              |
| POST   | /api/v1/entries            | Create new diary entry                  |
| GET    | /api/v1/entries            | List user's diary entries               |
| GET    | /api/v1/entries/{id}       | Specific diary entry details           |
| POST   | /api/v1/notifications      | Notification creation and management    |

---

## 9. Non-Functional Requirements

- **Performance:**
  - Page load time ideally under 2 seconds.
  - API response times average 500 ms or shorter (AI models exception).

- **Security:**
  - HTTPS requirement and JWT-based authentication.
  - OWASP standards compliance.

- **Accessibility & Compatibility:**
  - 99.9% uptime guarantee.
  - Full compatibility with modern browsers and mobile devices.

- **Scalability:**
  - Horizontally scalable infrastructure.
  - Resilient architecture against increasing user and data volume.

---

**Prepared by:** Zeynep Yiğit  
**Delivery Date:** July 3
