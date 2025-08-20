# MemoryMap - User Flow

## 1. Onboarding
1. User opens app → Registration / Login
2. Onboarding tutorial: intro to diary, maps, AI features
3. Initial mood & interest selection (personalization)

## 2. Daily Entry Flow
1. User writes a diary entry
2. Emotion & location extraction
3. Optionally attach media or visualize dreams
4. AI generates:
   - Visual for memory
   - Motivational quote card (based on mood)
   - Reflective questions (RAG + GPT-4)

## 3. Map & Memory Exploration
1. Open interactive map
2. Click markers → see diary entries & visuals
3. Filter by mood, location, or date
4. Search previous memories using natural language

## 4. Notifications & Reminders
1. MCP schedules:
   - Memory-based follow-ups
   - Motivational cards
   - Mood check-ins
2. Push notification opens relevant diary or visual

## 5. Personal Development Flow
1. User selects reflective session
2. GPT-4 + RAG retrieves context from previous entries & external references
3. Presents guiding questions & suggestions
4. User responds → system updates memory/context
