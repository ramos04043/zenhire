from typing import List
from datetime import datetime
from .base_provider import BaseStartupProvider
from ..types import StartupJob, StartupCandidateProfile, IndustryCategory


class RemoteOKProvider(BaseStartupProvider):
    """Remote OK job provider"""
    
    BASE_URL = "https://remoteok.com/api"
    
    @property
    def name(self) -> str:
        return "Remote OK"
    
    async def search_jobs(self, profile: StartupCandidateProfile) -> List[StartupJob]:
        """Search Remote OK jobs"""
        jobs = []
        
        try:
            response = await self.client.get(
                self.BASE_URL,
                headers={"User-Agent": "ZenHire/1.0"}
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Filter jobs based on profile
                for job_data in data[1:51]:  # Skip first item (metadata)
                    if self._matches_profile(job_data, profile):
                        job = self._parse_job(job_data)
                        if job:
                            jobs.append(job)
        
        except Exception as e:
            print(f"Remote OK provider error: {e}")
        
        return jobs
    
    def _matches_profile(self, job_data: dict, profile: StartupCandidateProfile) -> bool:
        """Check if job matches candidate profile"""
        title = job_data.get("position", "").lower()
        tags = [tag.lower() for tag in job_data.get("tags", [])]
        
        # Check if job title matches
        desired_lower = profile.desired_job_title.lower()
        if desired_lower not in title and not any(desired_lower in tag for tag in tags):
            return False
        
        return True
    
    def _parse_job(self, data: dict) -> StartupJob:
        """Parse Remote OK job data"""
        try:
            return StartupJob(
                id=f"remoteok_{data.get('id', '')}",
                provider=self.name,
                external_id=str(data.get("id", "")),
                title=data.get("position", ""),
                company=data.get("company", ""),
                company_logo=data.get("company_logo"),
                location="Remote",
                country=data.get("location"),
                salary_min=data.get("salary_min"),
                salary_max=data.get("salary_max"),
                employment_type=data.get("type", "full-time"),
                work_mode="remote",
                description=data.get("description", ""),
                skills=data.get("tags", []),
                apply_url=data.get("url", f"https://remoteok.com/remote-jobs/{data.get('id')}"),
                source=self.name,
                industries=self._extract_industries(data.get("tags", [])),
                posted_date=self._parse_date(data.get("date"))
            )
        except Exception as e:
            print(f"Error parsing Remote OK job: {e}")
            return None
    
    def _extract_industries(self, tags: List[str]) -> List[IndustryCategory]:
        """Extract industries from tags"""
        industries = []
        
        industry_map = {
            "ai": IndustryCategory.AI_ML,
            "ml": IndustryCategory.AI_ML,
            "saas": IndustryCategory.SAAS,
            "fintech": IndustryCategory.FINTECH,
            "dev": IndustryCategory.DEVELOPER_TOOLS,
            "health": IndustryCategory.HEALTHTECH,
            "edu": IndustryCategory.EDTECH,
            "security": IndustryCategory.CYBERSECURITY,
        }
        
        for tag in tags:
            tag_lower = tag.lower()
            for key, industry in industry_map.items():
                if key in tag_lower and industry not in industries:
                    industries.append(industry)
        
        return industries or [IndustryCategory.OTHER]
    
    def _parse_date(self, date_str: str) -> datetime:
        """Parse date string"""
        try:
            return datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        except:
            return datetime.now()
