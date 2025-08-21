from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional
from ..utils.auth import get_current_user, CurrentUser
from ..services.firestore_service import firestore_service

router = APIRouter(prefix="/api/v1/profile", tags=["profile"])


class ProfileUpdate(BaseModel):
    username: Optional[str] = None
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    bio: Optional[str] = None
    profile_picture_url: Optional[str] = None
    location: Optional[str] = None


@router.get("/me")
async def get_me(current_user: CurrentUser = Depends(get_current_user)):
    result = firestore_service.get_user_by_id(current_user.id)
    if not result.get("success") or not result.get("user"):
        raise HTTPException(status_code=404, detail="User not found")
    user = result["user"]
    user.pop("hashed_password", None)
    return user


@router.put("/me")
async def update_me(update: ProfileUpdate, current_user: CurrentUser = Depends(get_current_user)):
    if update.email:
        existing = firestore_service.get_user_by_email(update.email)
        if existing.get("success") and existing.get("user") and existing["user"].get("id") != current_user.id:
            raise HTTPException(status_code=400, detail="Email already in use")

    result = firestore_service.update_user(current_user.id, update.dict(exclude_unset=True))
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error", "Update failed"))
    updated = firestore_service.get_user_by_id(current_user.id)
    user = updated.get("user") or {}
    user.pop("hashed_password", None)
    return user


