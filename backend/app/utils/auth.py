from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
import os
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

# Şifre hashleme için PassLib context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT ayarları
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

# Şifre hashleme
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Şifre doğrulama
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# JWT token oluşturma
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# JWT token doğrulama
def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except Exception:
        return None

# Giriş yapmış kullanıcıyı döndüren dependency
class CurrentUser:
    def __init__(self, id: str, email: str, name: str):
        self.id = id
        self.email = email
        self.name = name


def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None or "user_id" not in payload:
        raise credentials_exception
    # Firestore ile uyumlu olması için user_id'yi string'e çevirme
    user_id_str = str(payload["user_id"])

    # Firestore'dan kullanıcıyı çek
    try:
        from ..services.firestore_service import firestore_service  # lazy import to avoid circular
        user_result = firestore_service.get_user_by_id(user_id_str)
        if not user_result.get("success"):
            raise credentials_exception
        user = user_result.get("user")
        if not user:
            raise credentials_exception
        # İsim alanı olmayabilir; username veya email kullan
        display_name = user.get("username") or user.get("full_name") or user.get("email") or "user"
        return CurrentUser(id=user_id_str, email=user.get("email", ""), name=display_name)
    except Exception:
        raise credentials_exception