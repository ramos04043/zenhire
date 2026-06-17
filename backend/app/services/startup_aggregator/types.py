"""
Types for Startup Job Aggregation Engine
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from enum import Enum


class StartupStage(str, Enum):
    PRE_SEED = "pre-seed"
    SEED = "seed"
    SERIES_A = "series-a"
    SERIES_B = "series-b"
    SERIES_C = "series-c"
    SERIES_D_PLUS = "series-d+"
    PUBLIC = "public"
    BOOTSTRAPPED = "bootstrapped"


class Industry(str, Enum):
    AI = "ai"
    SAAS = "saas"
    FINTECH = "fintech"
    DEVELOPER_TOOLS = "developer-tools"
    HEALTHTECH = "healthtech"
    EDTECH = "edtech"
    CYBERSECURITY = "cybersecurity"
    OPEN_SOURCE = "open-source"
    BLOCKCHAIN = "blockchain"
    CLIMATE = "climate"


class StartupCompany(BaseModel):
    """Startup company metadata"""
    name: str
    logo: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    stage: Optional[StartupStage] = None
    funding_amount: Optional[str] = None
    team_size: Optional[str] = None
    founded_year: Optional[int] = None
    industries: List[Industry] = []
    tech_stack: List[str] = []
    remote_policy: Optional[str] = None  # "remote-first", "hybrid", "onsite"
    yc_batch: Optional[str] = None
    hiring_status: bool = True


class StartupJob(BaseModel):
    """Enhanced job model for startups"""
    id: str
    provider: str
    external_id: str
    
    # Basic info
    title: str
    company: str
    company_logo: Optional[str] = None
    location: str
    country: Optional[str] = None
    
    # Compensation
    salary: Optional[str] = None
    equity: Optional[str] = None
    
    # Work arrangement
    employment_type: str
    work_mode: str
    remote_ok: bool = False
    visa_sponsorship: bool = False
    
    # Job details
    description: str
    skills: List[str] = []
    experience_level: Optional[str] = None
    apply_url: str
    posted_date: Optional[str] = None
    source: str
    
    # Startup specific
    startup_stage: Optional[StartupStage] = None
    funding_amount: Optional[str] = None
    team_size: Optional[str] = None
    tech_stack: List[str] = []
    industries: List[Industry] = []
    yc_company: bool = False
    
    # Ranking (populated later)
    match_score: Optional[int] = None
    match_reasons: List[str] = []
    missing_skills: List[str] = []
    matching_skills: List[str] = []


class StartupCandidateProfile(BaseModel):
    """Enhanced candidate profile for startup matching"""
    desired_job_title: str
    skills: List[str]
    experience_level: str
    preferred_locations: List[str]
    salary_expectation: Optional[int] = None
    work_mode: str = 'remote'
    employment_type: str = 'full-time'
    
    # Startup preferences
    preferred_stages: List[StartupStage] = []
    preferred_industries: List[Industry] = []
    equity_interest: bool = False
    visa_required: bool = False
    preferred_tech_stack: List[str] = []
    yc_only: bool = False
    followed_companies: List[str] = []


class StartupAggregationResult(BaseModel):
    """Result from startup aggregation"""
    jobs: List[StartupJob]
    total_jobs: int
    providers: List[str]
    execution_time: float
    errors: Dict[str, str]
    cached: bool
    deduplicated_count: int
    
    # Startup specific stats
    yc_companies_count: int
    ai_companies_count: int
    remote_jobs_count: int
    equity_jobs_count: int
