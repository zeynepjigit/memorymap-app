from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from .routes import auth
from .routes import diary
from .routes import diary_crud
from .routes import emotion
from .routes import location
from .routes import coaching
from .routes import editor
from .routes import coach_chat
from .routes import profile
from .routes import quotes
from .utils.auth import hash_password
from .middleware.security import (
    limiter, error_handling_middleware, security_headers_middleware,
    rate_limit_handler
)
from slowapi.errors import RateLimitExceeded
from .services.firestore_service import firestore_service

# Load environment variables from .env if present
load_dotenv()

app = FastAPI(
    title="MemoryMap API",
    description="AI-powered diary application API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS ayarları - frontend ile iletişim için
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tüm originlere izin ver (geliştirme için)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiter'ı app'e ekle
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_handler)

# Middleware'leri ekle
app.middleware("http")(error_handling_middleware)
app.middleware("http")(security_headers_middleware)

app.include_router(auth.router)
app.include_router(diary.router)
app.include_router(diary_crud.router)
app.include_router(emotion.router)
app.include_router(location.router)
app.include_router(coaching.router)
# Vision router removed
app.include_router(editor.router)
app.include_router(coach_chat.router)
app.include_router(profile.router)
app.include_router(quotes.router)

@app.get("/")
async def root():
    return {"message": "MemoryMap API is running!", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is working correctly"}

@app.get("/api/test")
async def test_endpoint():
    return {"message": "Backend connection successful!"}

@app.get("/api/test/firebase")
async def test_firebase():
    """Firebase bağlantısını test et"""
    result = firestore_service.test_connection()
    return result

@app.get("/api/test/providers")
async def test_providers():
    """Sağlayıcı anahtarları ve temel bağlantılar için hızlı kontrol"""
    import os
    providers = {
        "openai_key": bool(os.getenv("OPENAI_API_KEY")),
        "fal_key": bool(os.getenv("FAL_KEY")),
        "gemini_key": bool(os.getenv("GEMINI_API_KEY")),
        "stability_key": bool(os.getenv("STABILITY_API_KEY")),
        "huggingface_token": bool(os.getenv("HUGGINGFACE_API_TOKEN")),
        "firebase_initialized": bool(firestore_service.db),
    }
    return {"success": True, "providers": providers}

# Debug endpoint - API endpoints listesi
@app.get("/api/endpoints")
async def list_endpoints():
    """Mevcut tüm API endpoints'lerini listele"""
    routes = []
    for route in app.routes:
        if hasattr(route, 'methods') and hasattr(route, 'path'):
            routes.append({
                "path": route.path,
                "methods": list(route.methods),
                "name": getattr(route, 'name', 'Unknown')
            })
    return {"endpoints": routes} 

# Startup: ensure demo account exists
@app.on_event("startup")
async def seed_demo_account():
    try:
        demo_email = "demo@example.com"
        existing = firestore_service.get_user_by_email(demo_email)
        if existing.get("success") and not existing.get("user"):
            # create demo user
            demo_user = {
                "email": demo_email,
                "username": "demo",
                "full_name": "Demo User",
                "hashed_password": hash_password("demo123"),
                "bio": "Pre-seeded demo account",
            }
            res = firestore_service.create_user(demo_user)
            if res.get("success"):
                user_id = res.get("user_id")
                # seed demo diary in Firestore
                firestore_service.seed_demo_entries_for_user(user_id)
                # also seed vector DB for the demo user
                from .services.rag_coaching import rag_coaching_service
                rag_coaching_service.seed_demo_for_user(user_id)
        elif existing.get("success") and existing.get("user"):
            # Check if demo user already has entries, if not then seed
            user_id = existing["user"]["id"]
            entries_result = firestore_service.get_diary_entries(user_id, limit=1)
            if entries_result.get("success") and entries_result.get("count", 0) == 0:
                # Only seed if no entries exist
                firestore_service.seed_demo_entries_for_user(user_id)
            
            # ensure vector demo seeded for existing demo user
            from .services.rag_coaching import rag_coaching_service
            rag_coaching_service.seed_demo_for_user(user_id)
    except Exception:
        # best-effort; don't block app start
        pass