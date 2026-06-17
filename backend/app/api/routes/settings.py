from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.settings import Settings

router = APIRouter()

@router.get("/")
def get_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    settings = current_user.settings
    if not settings:
        settings = Settings(user_id=current_user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    return {
        "theme": settings.theme,
        "demo_mode_enabled": settings.demo_mode_enabled,
        "email_notifications": settings.email_notifications,
        "push_notifications": settings.push_notifications
    }

@router.put("/")
def update_settings(
    settings_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    settings = current_user.settings
    if not settings:
        settings = Settings(user_id=current_user.id)
        db.add(settings)
    
    for key, value in settings_data.items():
        if hasattr(settings, key):
            setattr(settings, key, value)
    
    db.commit()
    db.refresh(settings)
    
    return {"message": "Settings updated successfully", "settings": settings}
