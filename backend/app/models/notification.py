from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base

class NotificationType(str, enum.Enum):
    STATUS_CHANGE = "status_change"
    ATS_SCORE = "ats_score"
    RESUME_UPLOAD = "resume_upload"
    JOB_SAVED = "job_saved"
    RECRUITER_ACTIVITY = "recruiter_activity"
    SYSTEM = "system"

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(Enum(NotificationType))
    title = Column(String)
    message = Column(String)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="notifications")
