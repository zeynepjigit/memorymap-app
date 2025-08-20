from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from ..services.firestore_service import firestore_service
from ..utils.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Kullanıcı kayıt endpoint'i (Firestore ile örnek)
@router.post("/register")
async def register(user: UserCreate):
    # Firestore'da kullanıcı var mı kontrol et
    existing = firestore_service.get_user_by_email(user.email)
    if existing.get("success") and existing.get("user"):
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = hash_password(user.password)
    user_data = {
        "email": user.email,
        "username": user.username,
        "hashed_password": hashed_pw
    }
    result = firestore_service.create_user(user_data)
    if result.get("success"):
        return {"message": "User registered successfully"}
    else:
        raise HTTPException(status_code=500, detail=result.get("error", "Registration failed"))

# Kullanıcı giriş endpoint'i (Firestore ile örnek)
@router.post("/login")
async def login(user: UserLogin):
    result = firestore_service.get_user_by_email(user.email)
    if not result.get("success") or not result.get("user"):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    db_user = result["user"]
    if not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token({"sub": db_user["email"], "user_id": db_user.get("id")})
    return {"access_token": access_token, "token_type": "bearer"} 