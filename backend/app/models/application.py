from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base

class ApplicationStatus(str, enum.Enum):
    APPLIED = "applied"
    VIEWED = "viewed"
    DOWNLOADED = "downloaded"
    SHORTLISTED = "shortlisted"
    INTERVIEW = "interview"
    OFFER = "offer"
    REJECTED = "rejected"

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    company = Column(String, nullable=False)
    position = Column(String, nullable=False)
    location = Column(String)
    salary_range = Column(String)
    job_url = Column(String)
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.APPLIED)
    notes = Column(Text)
    applied_date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="applications")
    status_history = relationship("ApplicationStatusHistory", back_populates="application")

class ApplicationStatusHistory(Base):
    __tablename__ = "application_status_history"
    
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    status = Column(Enum(ApplicationStatus))
    changed_at = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text)
    
    application = relationship("Application", back_populates="status_history")
