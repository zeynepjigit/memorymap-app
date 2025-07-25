# Technologies and Tools (Tech Stack)

## Technologies and Tools to be Used

### Frontend
- **React.js (Web):** Modern, component-based user interface development. Provides interactive modules for users such as diary input, maps, and gallery.
- **React Native (Mobile):** Mobile app development for iOS and Android from a single codebase. Suitable for push notification, camera, and gallery integration.
- **Leaflet.js:** OpenStreetMap-based map visualization. Used for spatial marking of user memories and detailed display on maps.
- **OpenStreetMap API:** Converting place names to coordinates and providing map data.

### Backend
- **FastAPI (Python):** High-performance, asynchronous RESTful API development. Main business logic runs here for user management, diary processing, AI integrations, and notification management.
- **Python:** Main programming language for AI model integrations, data processing, and API development.

### Database
- **Supabase (PostgreSQL):** Secure and scalable storage of user, diary, analysis, and visual data. Real-time data updates and authentication support.

### Media Storage
- **Firebase Storage:** Secure cloud storage and fast access for user-owned visual and media files.

### Notifications
- **Firebase Cloud Messaging:** Used to send push notifications to mobile and web applications. Suitable for reminder and motivational messages.

### Analytics and Telemetry
- **Google Analytics / Firebase Analytics:** Monitoring and reporting user behaviors and in-app interactions.
- **Custom Telemetry APIs:** Additional data collection for monitoring user habits, emotion changes, and application performance.

### Other Integrations
- **JWT (JSON Web Token):** Secure session management and API access control.
- **HTTPS:** Security in all data transmission.

## Open Source AI Models

### Emotion Analysis
- **HuggingFace Transformers:**
  - `distilbert-base-uncased-finetuned-sst-2-english` model for emotion (positive/negative) analysis in English texts.
  - The model is integrated into the FastAPI backend to automatically process diary texts.

### Location/Place Extraction
- **spaCy NER:**
  - Extraction of spatial entities such as places, cities, countries from texts.
  - Suitable models can be selected for Turkish and English support.
- **HuggingFace NER Models:**
  - Alternatively, HuggingFace's NER models in various languages can be used.
- **OpenStreetMap API:**
  - Converting extracted place names to coordinates.

### Visual Generation
- **Stable Diffusion:**
  - Generates original visuals with keywords taken from user diaries.
  - The model runs on the backend and generated visuals are saved to Firebase Storage.

### Coaching Module
- **GPT-4 (OpenAI):**
  - Generates reflective questions and personal development suggestions for users.
  - Access is provided through API.
- **phi-2 (Alternative):**
  - Open source large language model. Can be used as an alternative in case of cost or access restrictions.
---

**Note:** All AI models are integrated into the FastAPI backend to provide automatic and real-time analysis. When necessary, models can be run cloud-based or locally. Security, scalability, and data privacy are prioritized at every layer.

## Non-Functional Requirements (Summary)

- **Security:** HTTPS in all data transmission, JWT-based authentication, compliance with OWASP standards.
- **Performance:** Page load time <2 sec, API response time average <500 ms (excluding AI operations).
- **Accessibility:** Full compatibility with modern browsers and mobile devices, 99.9% uptime.
- **Scalability:** Horizontally scalable infrastructure, resilient architecture against increasing user and data volume.

## API and User Roles (Reference)

- For basic API endpoint examples and user roles, see the user-flow.md file. 