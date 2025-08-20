from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth
from .routes import diary
from .routes import diary_crud
from .routes import emotion
from .routes import location
from .routes import coaching
from .middleware.security import (
    limiter, error_handling_middleware, security_headers_middleware,
    rate_limit_handler
)
from slowapi.errors import RateLimitExceeded
from .services.firestore_service import firestore_service

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