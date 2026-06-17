from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime


class CandidateProfile(BaseModel):
    desired_job_title: str
    skills: List[str]
    experience_level: str
    preferred_locations: List[str]
    salary_expectation: Optional[int] = None
    work_mode: str = 'remote'  # 'remote', 'hybrid', 'onsite', 'any'
    employment_type: str = 'full-time'  # 'full-time', 'part-time', 'contract', 'any'
    preferred_companies: Optional[List[str]] = None


class Job(BaseModel):
    id: str
    provider: str
    external_id: str
    title: str
    company: str
    company_logo: Optional[str] = None
    location: str
    country: Optional[str] = None
    salary: Optional[str] = None
    employment_type: str
    work_mode: str
    description: str
    skills: List[str]
    apply_url: str
    posted_date: Optional[str] = None
    source: str


class RankedJob(Job):
    match_score: int
    match_reason: List[str]
    missing_skills: List[str]
    matching_skills: List[str]
    skill_match: float
    experience_match: float
    location_match: float
    salary_match: float
    work_mode_match: float


class ProviderResult(BaseModel):
    provider: str
    jobs: List[Job]
    execution_time: float
    error: Optional[str] = None


class AggregationResult(BaseModel):
    jobs: List[RankedJob]
    total_jobs: int
    providers: List[str]
    execution_time: float
    errors: Dict[str, str]
    cached: bool
    deduplicated_count: int
