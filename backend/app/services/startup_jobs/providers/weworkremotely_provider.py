from typing import List
from datetime import datetime
from bs4 import BeautifulSoup
from .base_provider import BaseStartupProvider
from ..types import StartupJob, StartupCandidateProfile, IndustryCategory


class WeWorkRemotelyProvider(BaseStartupProvider):
    """We Work Remotely job provider"""
    
    BASE_URL = "https://weworkremotely.com"
    
    @property
    def name(self) -> str:
        return "We Work Remotely"
    
    async def search_jobs(self, profile: StartupCandidateProfile) -> List[StartupJob]:
        """Search We Work Remotely jobs"""
        jobs = []
        
        try:
            # Scrape job listings
            categories = self._get_categories(profile.desired_job_title)
            
            for category in categories:
                response = await self.client.get(
                    f"{self.BASE_URL}/remote-jobs/{category}",
                    follow_redirects=True
                )
                
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    job_listings = soup.find_all('li', class_='feature')
                    
                    for listing in job_listings[:20]:
                        job = self._parse_job(listing)
                        if job and self._matches_profile(job, profile):
                            jobs.append(job)
        
        except Exception as e:
            print(f"We Work Remotely provider error: {e}")
        
        return jobs
    
    def _get_categories(self, job_title: str) -> List[str]:
        """Get relevant job categories"""
        title_lower = job_title.lower()
        
        if any(word in title_lower for word in ["engineer", "developer", "programmer"]):
            return ["programming"]
        elif "design" in title_lower:
            return ["design"]
        elif "marketing" in title_lower:
            return ["marketing"]
        elif "sales" in title_lower:
            return ["sales"]
        elif "product" in title_lower:
            return ["product"]
        
        return ["programming"]  # Default
    
    def _parse_job(self, listing) -> StartupJob:
        """Parse job listing"""
        try:
            title_elem = listing.find('span', class_='title')
            company_elem = listing.find('span', class_='company')
            link_elem = listing.find('a')
            
            if not all([title_elem, company_elem, link_elem]):
                return None
            
            job_url = f"{self.BASE_URL}{link_elem.get('href')}"
            
            return StartupJob(
                id=f"wwr_{link_elem.get('href', '').split('/')[-1]}",
                provider=self.name,
                external_id=link_elem.get('href', '').split('/')[-1],
                title=title_elem.text.strip(),
                company=company_elem.text.strip(),
                location="Remote",
                employment_type="full-time",
                work_mode="remote",
                description="",  # Would need to fetch individual job page
                skills=[],
                apply_url=job_url,
                source=self.name,
                industries=[IndustryCategory.OTHER],
                posted_date=datetime.now()
            )
        except Exception as e:
            print(f"Error parsing WWR job: {e}")
            return None
    
    def _matches_profile(self, job: StartupJob, profile: StartupCandidateProfile) -> bool:
        """Check if job matches profile"""
        title_lower = job.title.lower()
        desired_lower = profile.desired_job_title.lower()
        
        return desired_lower in title_lower
