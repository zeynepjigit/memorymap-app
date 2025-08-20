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

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

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
    # Firestore'da kullanıcıyı bulma mantığı burada olmalı
    # Örneğin:
    # from firebase_admin import firestore
    # db = firestore.client()
    # user_ref = db.collection("users").document(user_id_str)
    # user_doc = user_ref.get()
    # if user_doc.exists:
    #     user_data = user_doc.to_dict()
    #     return user_data # Firestore'da kullanıcı bilgileri
    # else:
    #     raise credentials_exception
    # Bu kısım Firestore ile uyumlu hale getirilmelidir.
    # Şimdilik placeholder olarak döndürüyoruz.
    return {"id": user_id_str, "username": "test_user"} 