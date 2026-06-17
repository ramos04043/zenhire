from typing import List
from datetime import datetime
from .base_provider import BaseStartupProvider
from ..types import StartupJob, StartupCandidateProfile, StartupStage, IndustryCategory


class WellfoundProvider(BaseStartupProvider):
    """Wellfound (AngelList Talent) job provider"""
    
    BASE_URL = "https://wellfound.com/api/v1"
    
    @property
    def name(self) -> str:
        return "Wellfound"
    
    async def search_jobs(self, profile: StartupCandidateProfile) -> List[StartupJob]:
        """Search Wellfound jobs"""
        jobs = []
        
        try:
            # Wellfound GraphQL or REST API
            query_params = {
                "role": profile.desired_job_title,
                "location": ",".join(profile.preferred_locations) if profile.preferred_locations else "Remote",
                "remote": profile.work_mode == "remote"
            }
            
            # Note: Wellfound requires authentication for API access
            # This is a placeholder for the actual implementation
            response = await self.client.get(
                f"{self.BASE_URL}/jobs/search",
                params=query_params,
                headers={"Accept": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                for job_data in data.get("results", [])[:50]:
                    job = self._parse_wellfound_job(job_data)
                    if job:
                        jobs.append(job)
        
        except Exception as e:
            print(f"Wellfound provider error: {e}")
        
        return jobs
    
    def _parse_wellfound_job(self, data: dict) -> StartupJob:
        """Parse Wellfound job data"""
        try:
            startup = data.get("startup", {})
            
            return StartupJob(
                id=f"wellfound_{data.get('id', '')}",
                provider=self.name,
                external_id=str(data.get("id", "")),
                title=data.get("title", ""),
                company=startup.get("name", ""),
                company_logo=startup.get("logo_url"),
                location=self._format_location(data.get("location")),
                salary_min=data.get("salary_min"),
                salary_max=data.get("salary_max"),
                employment_type=data.get("job_type", "full-time"),
                work_mode=self._determine_work_mode(data),
                description=data.get("description", ""),
                skills=data.get("skills", []),
                apply_url=data.get("url", f"https://wellfound.com/l/{data.get('id')}"),
                source=self.name,
                startup_stage=self._map_stage(startup.get("stage")),
                team_size=startup.get("size"),
                funding_amount=startup.get("funding"),
                equity_offered=data.get("equity_offered", False),
                visa_sponsorship=data.get("visa_sponsor", False),
                industries=self._map_industries(startup.get("markets", [])),
                tech_stack=startup.get("tech_stack", []),
                posted_date=datetime.now()
            )
        except Exception as e:
            print(f"Error parsing Wellfound job: {e}")
            return None
    
    def _determine_work_mode(self, data: dict) -> str:
        """Determine work mode"""
        if data.get("remote_ok"):
            return "remote"
        elif data.get("hybrid"):
            return "hybrid"
        return "onsite"
    
    def _format_location(self, location: dict) -> str:
        """Format location data"""
        if not location:
            return "Remote"
        return f"{location.get('city', '')}, {location.get('country', '')}".strip(", ")
    
    def _map_stage(self, stage: str) -> StartupStage:
        """Map Wellfound stage to StartupStage"""
        if not stage:
            return StartupStage.UNKNOWN
        
        stage_map = {
            "idea": StartupStage.PRE_SEED,
            "pre-seed": StartupStage.PRE_SEED,
            "seed": StartupStage.SEED,
            "series a": StartupStage.SERIES_A,
            "series b": StartupStage.SERIES_B,
            "series c": StartupStage.SERIES_C,
            "series d": StartupStage.SERIES_D_PLUS,
            "public": StartupStage.PUBLIC
        }
        
        return stage_map.get(stage.lower(), StartupStage.UNKNOWN)
    
    def _map_industries(self, markets: List[str]) -> List[IndustryCategory]:
        """Map Wellfound markets to industries"""
        industries = []
        
        industry_map = {
            "artificial intelligence": IndustryCategory.AI_ML,
            "machine learning": IndustryCategory.AI_ML,
            "saas": IndustryCategory.SAAS,
            "fintech": IndustryCategory.FINTECH,
            "developer tools": IndustryCategory.DEVELOPER_TOOLS,
            "healthcare": IndustryCategory.HEALTHTECH,
            "education": IndustryCategory.EDTECH,
            "cybersecurity": IndustryCategory.CYBERSECURITY,
            "open source": IndustryCategory.OPEN_SOURCE,
        }
        
        for market in markets:
            market_lower = market.lower()
            for key, industry in industry_map.items():
                if key in market_lower and industry not in industries:
                    industries.append(industry)
        
        return industries or [IndustryCategory.OTHER]
