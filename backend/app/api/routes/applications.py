from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.application import Application, ApplicationStatus, ApplicationStatusHistory
from app.models.notification import Notification, NotificationType
from typing import Optional

router = APIRouter()

@router.post("/")
def create_application(
    application_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    application = Application(
        user_id=current_user.id,
        company=application_data["company"],
        position=application_data["position"],
        location=application_data.get("location"),
        salary_range=application_data.get("salary_range"),
        job_url=application_data.get("job_url"),
        notes=application_data.get("notes")
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    
    history = ApplicationStatusHistory(
        application_id=application.id,
        status=ApplicationStatus.APPLIED
    )
    db.add(history)
    db.commit()
    
    return application

@router.get("/")
def get_applications(
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Application).filter(Application.user_id == current_user.id)
    
    if status:
        query = query.filter(Application.status == status)
    
    applications = query.all()
    return applications

@router.put("/{application_id}")
def update_application(
    application_id: int,
    application_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    old_status = application.status
    
    for key, value in application_data.items():
        if hasattr(application, key):
            setattr(application, key, value)
    
    db.commit()
    
    if "status" in application_data and old_status != application_data["status"]:
        history = ApplicationStatusHistory(
            application_id=application.id,
            status=application_data["status"]
        )
        db.add(history)
        
        notification = Notification(
            user_id=current_user.id,
            type=NotificationType.STATUS_CHANGE,
            title="Application Status Updated",
            message=f"Your application at {application.company} moved to {application_data['status']}"
        )
        db.add(notification)
        db.commit()
    
    db.refresh(application)
    return application

@router.delete("/{application_id}")
def delete_application(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    db.delete(application)
    db.commit()
    
    return {"message": "Application deleted successfully"}

@router.get("/stats")
def get_application_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total = db.query(func.count(Application.id)).filter(
        Application.user_id == current_user.id
    ).scalar()
    
    stats_by_status = {}
    for status in ApplicationStatus:
        count = db.query(func.count(Application.id)).filter(
            Application.user_id == current_user.id,
            Application.status == status
        ).scalar()
        stats_by_status[status.value] = count
    
    return {
        "total": total,
        "by_status": stats_by_status
    }
