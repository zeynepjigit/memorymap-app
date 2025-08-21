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

## AI Models & Services (Current Implementation)

### Emotion Analysis Stack
- **Primary Model:** `cardiffnlp/twitter-roberta-base-sentiment-latest` (HuggingFace)
  - Advanced sentiment analysis with confidence scoring
  - Optimized for social media and diary-style text
  - Multi-class emotion detection (positive, negative, neutral)
- **Fallback Models:** DistilBERT and other transformer variants
- **Custom Analytics:** Model performance tracking and accuracy monitoring

### Location Intelligence
- **spaCy NER Pipeline:**
  - `en_core_web_sm` for English location extraction
  - Custom entity recognition for place names, landmarks, addresses
  - Multi-language support capability
- **Geocoding Services:**
  - OpenStreetMap Nominatim API for coordinate conversion
  - Location validation and enrichment
  - Reverse geocoding for coordinate-to-address conversion

### Multi-Provider Image Generation
- **Stable Diffusion (Primary):**
  - Local deployment for privacy and cost control
  - Custom prompt engineering for diary-specific visuals
  - High-quality, contextual image generation
- **FAL.ai Integration:**
  - Fast API-based image generation
  - Multiple model variants (SDXL, Lightning, etc.)
  - Optimized for speed and quality
- **Google Gemini Vision:**
  - Advanced visual understanding and generation
  - Multi-modal capabilities for text-to-image
  - Integration with Google's latest AI models

### Large Language Models
- **OpenAI GPT-4:**
  - Advanced reasoning for personal development coaching
  - Context-aware conversation and advice generation
  - RAG integration for personalized responses
- **Google Gemini Pro:**
  - Alternative LLM provider for diversity
  - Advanced reasoning and creative capabilities
  - Cost-effective scaling option
- **RAG Implementation:**
  - ChromaDB vector database for memory storage
  - sentence-transformers for embedding generation
  - Custom retrieval and ranking algorithms

### Embeddings & Vector Search
- **OpenAI Embeddings:** `text-embedding-ada-002` for semantic search
- **sentence-transformers:** Open-source alternative embeddings
- **ChromaDB:** Vector database for efficient similarity search
- **Custom RAG Pipeline:** Retrieval-Augmented Generation for coaching
---

**Note:** All AI models are integrated into the FastAPI backend to provide automatic and real-time analysis. When necessary, models can be run cloud-based or locally. Security, scalability, and data privacy are prioritized at every layer.

## Non-Functional Requirements (Summary)

- **Security:** HTTPS in all data transmission, JWT-based authentication, compliance with OWASP standards.
- **Performance:** Page load time <2 sec, API response time average <500 ms (excluding AI operations).
- **Accessibility:** Full compatibility with modern browsers and mobile devices, 99.9% uptime.
- **Scalability:** Horizontally scalable infrastructure, resilient architecture against increasing user and data volume.

## API and User Roles (Reference)

- For basic API endpoint examples and user roles, see the user-flow.md file. 