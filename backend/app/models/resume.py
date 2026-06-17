from sqlalchemy import Column, String, ForeignKey, DateTime, JSON, Numeric, Text
from sqlalchemy.dialects.postgresql import UUID, ARRAY, JSONB
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.database import Base


def _uuid():
    return str(uuid.uuid4())


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String(36), primary_key=True, default=_uuid, index=True)
    user_id = Column(String(36), nullable=True, index=True)
    filename = Column(String)
    file_path = Column(String)
    parsed_data = Column(JSON)
    ats_score = Column(Numeric)
    is_primary = Column(String, default="0")
    status = Column(String, default="completed")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc))

    ats_analysis = relationship("ATSScore", back_populates="resume", uselist=False)


class ATSScore(Base):
    """
    Matches the ats_scores table schema:
      id           uuid NOT NULL
      resume_id    uuid NOT NULL
      score        numeric NOT NULL
      strengths    ARRAY
      weaknesses   ARRAY
      recommendations ARRAY
      keyword_analysis jsonb
      created_at   timestamptz
    """
    __tablename__ = "ats_scores"

    id = Column(String(36), primary_key=True, default=_uuid, index=True)
    resume_id = Column(String(36), ForeignKey("resumes.id"), nullable=False, index=True)
    score = Column(Numeric, nullable=False)
    # Stored as JSON (ARRAY in Postgres, JSON in SQLite — both serialize lists correctly)
    strengths = Column(JSON, default=list)
    weaknesses = Column(JSON, default=list)
    recommendations = Column(JSON, default=list)
    keyword_analysis = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    resume = relationship("Resume", back_populates="ats_analysis")
