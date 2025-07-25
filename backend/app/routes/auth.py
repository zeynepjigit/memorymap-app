from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field
from ..models import user as user_model
from ..utils.database import get_db
from ..utils.auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

# Pydantic modelleri
def UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str

def UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: str = Field(None, example="Yeni İsim")
    email: EmailStr = Field(None, example="yeni@email.com")

# Kullanıcı kayıt endpoint'i
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(user_model.User).filter(user_model.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = hash_password(user.password)
    new_user = user_model.User(email=user.email, name=user.name, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}

# Kullanıcı giriş endpoint'i
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(user_model.User).filter(user_model.User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token({"sub": db_user.email, "user_id": db_user.id})
    return {"access_token": access_token, "token_type": "bearer"}

# Giriş yapmış kullanıcının bilgilerini dönen korumalı endpoint
@router.get("/me")
def read_current_user(current_user=Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "created_at": current_user.created_at
    }

# Kullanıcı profilini görüntüleme
@router.get("/profile")
def get_profile(current_user=Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "created_at": current_user.created_at
    }

# Kullanıcı profilini güncelleme
@router.put("/profile")
def update_profile(update: UserUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    updated = False
    if update.name:
        current_user.name = update.name
        updated = True
    if update.email:
        # E-posta benzersiz olmalı
        existing = db.query(user_model.User).filter(user_model.User.email == update.email, user_model.User.id != current_user.id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already in use")
        current_user.email = update.email
        updated = True
    if updated:
        db.commit()
        db.refresh(current_user)
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "created_at": current_user.created_at
    } 