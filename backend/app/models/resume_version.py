from sqlalchemy import Column, Integer, String, Float, JSON, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class ResumeVersion(Base):
    __tablename__ = "resume_versions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)          # ZendBX user UUID
    resume_id = Column(String, nullable=True)      # ZendBX resume UUID (optional)
    job_id = Column(String, nullable=True)
    company_name = Column(String, nullable=True)
    job_title = Column(String, nullable=True)
    ats_before = Column(Float, nullable=True)
    ats_after = Column(Float, nullable=True)
    added_keywords = Column(JSON, default=list)
    missing_keywords = Column(JSON, default=list)
    changes = Column(JSON, default=list)
    strengths = Column(JSON, default=list)
    remaining_weaknesses = Column(JSON, default=list)
    optimized_summary = Column(String, nullable=True)
    optimized_experience = Column(JSON, default=list)
    optimized_projects = Column(JSON, default=list)
    optimized_skills = Column(JSON, default=list)
    optimized_resume_markdown = Column(Text, nullable=True)
    optimized_resume_html = Column(Text, nullable=True)
    original_parsed_data = Column(JSON, nullable=True)
    optimization_metadata = Column(JSON, nullable=True)  # Track AI provider, model, etc.
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
