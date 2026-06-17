from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class FollowedCompany(Base):
    """Companies that users follow for job alerts"""
    __tablename__ = "followed_companies"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company_name = Column(String, nullable=False, index=True)
    company_logo = Column(String)
    company_website = Column(String)
    
    # Notification settings
    notify_on_new_job = Column(Boolean, default=True)
    job_title_filter = Column(JSON)  # List of job titles to filter
    
    # Timestamps
    followed_at = Column(DateTime, default=datetime.utcnow)
    last_checked_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", backref="followed_companies")
    
    def __repr__(self):
        return f"<FollowedCompany {self.company_name} by User {self.user_id}>"


class CompanyJobAlert(Base):
    """Job alerts for followed companies"""
    __tablename__ = "company_job_alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    followed_company_id = Column(Integer, ForeignKey("followed_companies.id"), nullable=False)
    
    # Job details
    job_title = Column(String, nullable=False)
    job_url = Column(String, nullable=False)
    job_external_id = Column(String, index=True)
    company_name = Column(String, nullable=False)
    
    # Alert status
    is_sent = Column(Boolean, default=False)
    is_read = Column(Boolean, default=False)
    sent_at = Column(DateTime)
    read_at = Column(DateTime)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", backref="company_job_alerts")
    followed_company = relationship("FollowedCompany", backref="job_alerts")
    
    def __repr__(self):
        return f"<CompanyJobAlert {self.job_title} at {self.company_name}>"
