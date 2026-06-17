from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime
from enum import Enum


class StartupStage(str, Enum):
    PRE_SEED = "pre-seed"
    SEED = "seed"
    SERIES_A = "series-a"
    SERIES_B = "series-b"
    SERIES_C = "series-c"
    SERIES_D_PLUS = "series-d+"
    PUBLIC = "public"
    UNKNOWN = "unknown"


class IndustryCategory(str, Enum):
    AI_ML = "ai-ml"
    SAAS = "saas"
    FINTECH = "fintech"
    DEVELOPER_TOOLS = "developer-tools"
    HEALTHTECH = "healthtech"
    EDTECH = "edtech"
    CYBERSECURITY = "cybersecurity"
    OPEN_SOURCE = "open-source"
    WEB3 = "web3"
    CLIMATE_TECH = "climate-tech"
    ECOMMERCE = "ecommerce"
    OTHER = "other"


class RemotePolicy(str, Enum):
    FULLY_REMOTE = "fully-remote"
    HYBRID = "hybrid"
    ONSITE = "onsite"
    REMOTE_FIRST = "remote-first"
    FLEXIBLE = "flexible"


class StartupProfile(BaseModel):
    name: str
    logo_url: Optional[str] = None
    website: Optional[str] = None
    careers_url: Optional[str] = None
    stage: StartupStage = StartupStage.UNKNOWN
    funding_amount: Optional[int] = None  # in USD
    team_size: Optional[int] = None
    remote_policy: Optional[RemotePolicy] = None
    industries: List[IndustryCategory] = []
    tech_stack: List[str] = []
    founded_year: Optional[int] = None
    description: Optional[str] = None
    is_yc_company: bool = False
    is_hiring: bool = True
    growth_rate: Optional[str] = None  # e.g., "High", "Medium"
    locations: List[str] = []


class StartupCandidateProfile(BaseModel):
    desired_job_title: str
    skills: List[str]
    experience_level: str  # junior, mid, senior, staff, principal
    preferred_locations: List[str]
    salary_expectation: Optional[int] = None
    work_mode: str = 'remote'
    employment_type: str = 'full-time'
    preferred_companies: Optional[List[str]] = None
    preferred_startup_stages: List[StartupStage] = []
    preferred_industries: List[IndustryCategory] = []
    preferred_tech_stack: List[str] = []
    equity_important: bool = False
    visa_sponsorship_required: bool = False
    min_team_size: Optional[int] = None
    max_team_size: Optional[int] = None


class StartupJob(BaseModel):
    id: str
    provider: str
    external_id: str
    
    # Basic job info
    title: str
    company: str
    company_logo: Optional[str] = None
    location: str
    country: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: Optional[str] = "USD"
    employment_type: str
    work_mode: str
    experience_level: Optional[str] = None
    
    # Startup-specific fields
    startup_stage: Optional[StartupStage] = None
    team_size: Optional[int] = None
    funding_amount: Optional[int] = None
    remote_policy: Optional[RemotePolicy] = None
    equity_offered: Optional[bool] = None
    visa_sponsorship: Optional[bool] = None
    industries: List[IndustryCategory] = []
    tech_stack: List[str] = []
    
    # Job details
    description: str
    skills: List[str] = []
    apply_url: str
    posted_date: Optional[datetime] = None
    source: str
    
    # Company intelligence
    company_profile: Optional[StartupProfile] = None
    is_yc_company: bool = False
    is_dream_company: bool = False


class RankedStartupJob(StartupJob):
    match_score: int  # 0-100
    match_reason: List[str]
    
    # Matching details
    missing_skills: List[str]
    matching_skills: List[str]
    skill_match: float
    experience_match: float
    location_match: float
    salary_match: float
    work_mode_match: float
    
    # Startup-specific matching
    startup_stage_match: float
    industry_match: float
    tech_stack_match: float
    company_culture_match: float


class ProviderResult(BaseModel):
    provider: str
    jobs: List[StartupJob]
    execution_time: float
    error: Optional[str] = None


class StartupAggregationResult(BaseModel):
    jobs: List[RankedStartupJob]
    total_jobs: int
    providers: List[str]
    execution_time: float
    errors: Dict[str, str]
    cached: bool
    deduplicated_count: int
    startup_count: int
    yc_company_count: int
