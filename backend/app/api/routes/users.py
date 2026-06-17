from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse
from app.services.encryption_service import EncryptionService

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)

@router.get("/profile")
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.profile
    return {
        "id": profile.id if profile else None,
        "phone": EncryptionService.decrypt(profile.phone) if profile and profile.phone else None,
        "location": profile.location if profile else None,
        "title": profile.title if profile else None,
        "bio": profile.bio if profile else None,
        "linkedin_url": profile.linkedin_url if profile else None,
        "github_url": profile.github_url if profile else None,
        "portfolio_url": profile.portfolio_url if profile else None,
        "avatar_url": profile.avatar_url if profile else None,
        "is_complete": profile.is_complete if profile else False
    }

@router.put("/profile")
def update_profile(
    profile_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.profile
    if profile:
        for key, value in profile_data.items():
            if hasattr(profile, key):
                if key == 'phone' and value:
                    value = EncryptionService.encrypt(value)
                setattr(profile, key, value)
        
        # Calculate completion rate
        all_fields = ['phone', 'location', 'title', 'bio', 'linkedin_url', 'github_url', 'portfolio_url', 'avatar_url']
        completed_count = 0
        for field in all_fields:
            val = getattr(profile, field)
            if val and str(val).strip():
                completed_count += 1
        
        completion_rate = int((completed_count / len(all_fields)) * 100)
        current_user.profile_completion_rate = completion_rate
        profile.is_complete = (completion_rate == 100)
        
        db.commit()
        db.refresh(profile)
        db.refresh(current_user)
    return {
        "message": "Profile updated successfully", 
        "is_complete": profile.is_complete if profile else False,
        "completion_rate": current_user.profile_completion_rate
    }
