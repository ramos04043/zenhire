from typing import List
import httpx
from bs4 import BeautifulSoup
from datetime import datetime
from .base_provider import BaseStartupProvider
from ..types import StartupJob, StartupCandidateProfile, StartupStage, IndustryCategory


class YCombinatorProvider(BaseStartupProvider):
    """Y Combinator Work at a Startup job provider"""
    
    BASE_URL = "https://www.ycombinator.com/companies"
    JOBS_API = "https://api.ycombinator.com/v0.1/jobs"
    
    @property
    def name(self) -> str:
        return "Y Combinator"
    
    async def search_jobs(self, profile: StartupCandidateProfile) -> List[StartupJob]:
        """Search Y Combinator jobs"""
        jobs = []
        
        try:
            # YC Work at a Startup API (if available)
            params = {
                "q": profile.desired_job_title,
                "remote": "true" if profile.work_mode == "remote" else "false"
            }
            
            response = await self.client.get(
                "https://www.workatastartup.com/api/search",
                params=params,
                follow_redirects=True
            )
            
            if response.status_code == 200:
                data = response.json()
                for job_data in data.get("jobs", [])[:50]:
                    job = self._parse_yc_job(job_data, profile)
                    if job:
                        jobs.append(job)
        except Exception as e:
            print(f"YC provider error: {e}")
        
        return jobs
    
    def _parse_yc_job(self, data: dict, profile: StartupCandidateProfile) -> StartupJob:
        """Parse YC job data"""
        try:
            return StartupJob(
                id=f"yc_{data.get('id', '')}",
                provider=self.name,
                external_id=str(data.get("id", "")),
                title=data.get("title", ""),
                company=data.get("company", {}).get("name", ""),
                company_logo=data.get("company", {}).get("logo_url"),
                location=data.get("location", "Remote"),
                employment_type=data.get("job_type", "full-time"),
                work_mode=self._determine_work_mode(data),
                description=data.get("description", ""),
                skills=self._extract_skills(data.get("description", "")),
                apply_url=data.get("url", ""),
                source=self.name,
                startup_stage=self._determine_stage(data.get("company", {})),
                team_size=data.get("company", {}).get("team_size"),
                is_yc_company=True,
                industries=self._extract_industries(data.get("company", {})),
                posted_date=datetime.now()
            )
        except Exception as e:
            print(f"Error parsing YC job: {e}")
            return None
    
    def _determine_work_mode(self, data: dict) -> str:
        """Determine work mode from job data"""
        location = data.get("location", "").lower()
        if "remote" in location:
            return "remote"
        elif "hybrid" in location:
            return "hybrid"
        return "onsite"
    
    def _determine_stage(self, company_data: dict) -> StartupStage:
        """Determine startup stage from company data"""
        batch = company_data.get("batch", "")
        if batch:
            year = int(batch[1:3]) if len(batch) > 2 else 0
            if year >= 20:  # 2020 or later
                return StartupStage.SEED
            elif year >= 15:
                return StartupStage.SERIES_A
            else:
                return StartupStage.SERIES_B
        return StartupStage.UNKNOWN
    
    def _extract_industries(self, company_data: dict) -> List[IndustryCategory]:
        """Extract industries from company data"""
        industries = []
        tags = company_data.get("tags", [])
        
        industry_map = {
            "ai": IndustryCategory.AI_ML,
            "ml": IndustryCategory.AI_ML,
            "saas": IndustryCategory.SAAS,
            "fintech": IndustryCategory.FINTECH,
            "developer tools": IndustryCategory.DEVELOPER_TOOLS,
            "health": IndustryCategory.HEALTHTECH,
            "education": IndustryCategory.EDTECH,
            "security": IndustryCategory.CYBERSECURITY,
        }
        
        for tag in tags:
            tag_lower = tag.lower()
            for key, industry in industry_map.items():
                if key in tag_lower and industry not in industries:
                    industries.append(industry)
        
        return industries or [IndustryCategory.OTHER]
    
    def _extract_skills(self, description: str) -> List[str]:
        """Extract skills from job description"""
        skills = []
        common_skills = [
            "Python", "JavaScript", "TypeScript", "React", "Node.js",
            "Go", "Rust", "Java", "C++", "PostgreSQL", "MongoDB",
            "AWS", "GCP", "Azure", "Docker", "Kubernetes", "ML", "AI"
        ]
        
        desc_lower = description.lower()
        for skill in common_skills:
            if skill.lower() in desc_lower:
                skills.append(skill)
        
        return skills
