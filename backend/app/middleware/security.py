from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import time
import logging
from typing import Callable
import re

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

# Security patterns
SUSPICIOUS_PATTERNS = [
    r'<script.*?>.*?</script>',  # XSS
    r'union.*select',  # SQL Injection
    r'drop\s+table',   # SQL Injection
    r'javascript:',    # XSS
    r'on\w+\s*=',     # Event handlers
]

# Input validation
def validate_input_security(text: str) -> bool:
    """
    Güvenlik açısından tehlikeli inputları kontrol eder
    """
    if not text:
        return True
    
    text_lower = text.lower()
    
    for pattern in SUSPICIOUS_PATTERNS:
        if re.search(pattern, text_lower, re.IGNORECASE):
            return False
    
    return True

def sanitize_input(text: str, max_length: int = 10000) -> str:
    """
    Input'u temizler ve güvenli hale getirir
    """
    if not text:
        return ""
    
    # Uzunluk kontrolü
    if len(text) > max_length:
        text = text[:max_length]
    
    # Tehlikeli karakterleri temizle
    text = re.sub(r'<[^>]*>', '', text)  # HTML tags
    text = re.sub(r'javascript:', '', text, flags=re.IGNORECASE)
    text = text.strip()
    
    return text

# Error handling middleware
async def error_handling_middleware(request: Request, call_next: Callable):
    """
    Global error handling middleware
    """
    start_time = time.time()
    
    try:
        response = await call_next(request)
        
        # Response time tracking
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        
        return response
        
    except HTTPException as exc:
        # HTTP exceptions'ı logla
        logging.warning(f"HTTP Exception: {exc.status_code} - {exc.detail}")
        raise exc
        
    except Exception as exc:
        # Beklenmeyen hataları logla
        logging.error(f"Unexpected error: {str(exc)}", exc_info=True)
        
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "Internal server error",
                "message": "An unexpected error occurred",
                "timestamp": time.time()
            }
        )

# Security headers middleware
async def security_headers_middleware(request: Request, call_next: Callable):
    """
    Güvenlik başlıklarını ekler
    """
    response = await call_next(request)
    
    # Security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    
    return response

# Request validation
def validate_content_length(request: Request, max_size: int = 10 * 1024 * 1024):  # 10MB
    """
    Request boyutunu kontrol eder
    """
    content_length = request.headers.get("content-length")
    if content_length and int(content_length) > max_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Request too large"
        )

def validate_request_headers(request: Request):
    """
    Request headerlarını kontrol eder
    """
    # User-Agent kontrolü
    user_agent = request.headers.get("user-agent", "")
    if not user_agent or len(user_agent) < 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid User-Agent"
        )
    
    # Content-Type kontrolü (POST/PUT istekleri için)
    if request.method in ["POST", "PUT", "PATCH"]:
        content_type = request.headers.get("content-type", "")
        if not content_type.startswith("application/json"):
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail="Unsupported media type"
            )

# Rate limit handler
def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    """
    Rate limit aşıldığında özel response
    """
    return JSONResponse(
        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        content={
            "error": "Rate limit exceeded",
            "message": f"Too many requests. Retry after {exc.retry_after} seconds.",
            "retry_after": exc.retry_after
        }
    )

# IP whitelist/blacklist
BLACKLISTED_IPS = set()
WHITELISTED_IPS = set()

def check_ip_access(request: Request):
    """
    IP erişim kontrolü
    """
    client_ip = get_remote_address(request)
    
    # Blacklist kontrolü
    if client_ip in BLACKLISTED_IPS:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Whitelist varsa ve IP whitelist'te değilse
    if WHITELISTED_IPS and client_ip not in WHITELISTED_IPS:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )

# API key validation
def validate_api_key(api_key: str) -> bool:
    """
    API key doğrulaması (örnek implementasyon)
    """
    # Gerçek implementasyonda veritabanından kontrol edilecek
    valid_keys = ["demo_api_key_123", "test_key_456"]
    return api_key in valid_keys 