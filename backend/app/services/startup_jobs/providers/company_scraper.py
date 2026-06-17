from typing import List
from datetime import datetime
from bs4 import BeautifulSoup
from .base_provider import BaseStartupProvider
from ..types import StartupJob, StartupCandidateProfile
from ..company_registry import StartupCompanyRegistry


class CompanyScraperProvider(BaseStartupProvider):
    """Scrapes jobs directly from dream company career pages"""
    
    @property
    def name(self) -> str:
        return "Company Careers"
    
    async def search_jobs(self, profile: StartupCandidateProfile) -> List[StartupJob]:
        """Scrape jobs from dream companies"""
        jobs = []
        
        # Get all registered companies
        companies = StartupCompanyRegistry.get_all_companies()
        
        for company in companies:
            if not company.careers_url or not company.is_hiring:
                continue
            
            try:
                company_jobs = await self._scrape_company(company, profile)
                jobs.extend(company_jobs)
            except Exception as e:
                print(f"Error scraping {company.name}: {e}")
        
        return jobs
    
    async def _scrape_company(self, company, profile: StartupCandidateProfile) -> List[StartupJob]:
        """Scrape jobs from a specific company"""
        jobs = []
        
        try:
            # Check if company uses common ATS
            if "greenhouse.io" in company.careers_url:
                jobs = await self._scrape_greenhouse(company, profile)
            elif "lever.co" in company.careers_url:
                jobs = await self._scrape_lever(company, profile)
            elif "ashbyhq.com" in company.careers_url:
                jobs = await self._scrape_ashby(company, profile)
            elif "workable.com" in company.careers_url:
                jobs = await self._scrape_workable(company, profile)
            else:
                # Generic scraper
                jobs = await self._scrape_generic(company, profile)
        
        except Exception as e:
            print(f"Error scraping {company.name}: {e}")
        
        return jobs
    
    async def _scrape_greenhouse(self, company, profile) -> List[StartupJob]:
        """Scrape Greenhouse-powered careers page"""
        jobs = []
        
        try:
            # Extract board token from URL
            response = await self.client.get(company.careers_url, follow_redirects=True)
            
            if "board_token" in response.url.path or "embed/job_board" in response.url.path:
                # Try API endpoint
                board_url = str(response.url).replace("/jobs", "")
                api_url = f"{board_url}/embed/job_board/jobs"
                
                api_response = await self.client.get(api_url)
                if api_response.status_code == 200:
                    data = api_response.json()
                    
                    for job_data in data.get("jobs", []):
                        if self._matches_profile_keywords(job_data.get("title", ""), profile):
                            jobs.append(self._create_startup_job(company, job_data, "greenhouse"))
        
        except Exception as e:
            print(f"Greenhouse scraping error for {company.name}: {e}")
        
        return jobs
    
    async def _scrape_lever(self, company, profile) -> List[StartupJob]:
        """Scrape Lever-powered careers page"""
        jobs = []
        
        try:
            response = await self.client.get(company.careers_url, follow_redirects=True)
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                postings = soup.find_all('div', class_='posting')
                
                for posting in postings:
                    title_elem = posting.find('h5')
                    if title_elem and self._matches_profile_keywords(title_elem.text, profile):
                        link = posting.find('a', class_='posting-title')
                        
                        jobs.append(StartupJob(
                            id=f"company_{company.name}_{link.get('href', '').split('/')[-1]}",
                            provider=self.name,
                            external_id=link.get('href', '').split('/')[-1],
                            title=title_elem.text.strip(),
                            company=company.name,
                            company_logo=company.logo_url,
                            location=posting.find('span', class_='location').text if posting.find('span', class_='location') else "Remote",
                            employment_type="full-time",
                            work_mode=str(company.remote_policy.value) if company.remote_policy else "remote",
                            description="",
                            skills=[],
                            apply_url=link.get('href', ''),
                            source=self.name,
                            startup_stage=company.stage,
                            team_size=company.team_size,
                            funding_amount=company.funding_amount,
                            industries=company.industries,
                            tech_stack=company.tech_stack,
                            is_yc_company=company.is_yc_company,
                            is_dream_company=True,
                            company_profile=company,
                            posted_date=datetime.now()
                        ))
        
        except Exception as e:
            print(f"Lever scraping error for {company.name}: {e}")
        
        return jobs
    
    async def _scrape_ashby(self, company, profile) -> List[StartupJob]:
        """Scrape Ashby-powered careers page"""
        # Similar implementation to Lever
        return []
    
    async def _scrape_workable(self, company, profile) -> List[StartupJob]:
        """Scrape Workable-powered careers page"""
        # Similar implementation to Lever
        return []
    
    async def _scrape_generic(self, company, profile) -> List[StartupJob]:
        """Generic scraper for custom careers pages"""
        jobs = []
        
        try:
            response = await self.client.get(company.careers_url, follow_redirects=True)
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Look for common job listing patterns
                job_links = soup.find_all('a', href=True)
                
                for link in job_links:
                    link_text = link.get_text().strip()
                    if self._matches_profile_keywords(link_text, profile) and len(link_text) > 10:
                        jobs.append(StartupJob(
                            id=f"company_{company.name}_{abs(hash(link['href']))}",
                            provider=self.name,
                            external_id=str(abs(hash(link['href']))),
                            title=link_text,
                            company=company.name,
                            company_logo=company.logo_url,
                            location="Remote",
                            employment_type="full-time",
                            work_mode=str(company.remote_policy.value) if company.remote_policy else "remote",
                            description="",
                            skills=[],
                            apply_url=link['href'] if link['href'].startswith('http') else f"{company.website}{link['href']}",
                            source=self.name,
                            startup_stage=company.stage,
                            team_size=company.team_size,
                            funding_amount=company.funding_amount,
                            industries=company.industries,
                            tech_stack=company.tech_stack,
                            is_yc_company=company.is_yc_company,
                            is_dream_company=True,
                            company_profile=company,
                            posted_date=datetime.now()
                        ))
        
        except Exception as e:
            print(f"Generic scraping error for {company.name}: {e}")
        
        return jobs
    
    def _matches_profile_keywords(self, text: str, profile: StartupCandidateProfile) -> bool:
        """Check if text matches profile keywords"""
        text_lower = text.lower()
        desired_lower = profile.desired_job_title.lower()
        
        # Check job title match
        keywords = desired_lower.split()
        return any(keyword in text_lower for keyword in keywords)
    
    def _create_startup_job(self, company, job_data: dict, ats_type: str) -> StartupJob:
        """Create StartupJob from scraped data"""
        return StartupJob(
            id=f"company_{company.name}_{job_data.get('id', '')}",
            provider=self.name,
            external_id=str(job_data.get("id", "")),
            title=job_data.get("title", ""),
            company=company.name,
            company_logo=company.logo_url,
            location=job_data.get("location", {}).get("name", "Remote") if isinstance(job_data.get("location"), dict) else job_data.get("location", "Remote"),
            employment_type="full-time",
            work_mode=str(company.remote_policy.value) if company.remote_policy else "remote",
            description=job_data.get("description", ""),
            skills=[],
            apply_url=job_data.get("absolute_url", ""),
            source=self.name,
            startup_stage=company.stage,
            team_size=company.team_size,
            funding_amount=company.funding_amount,
            industries=company.industries,
            tech_stack=company.tech_stack,
            is_yc_company=company.is_yc_company,
            is_dream_company=True,
            company_profile=company,
            posted_date=datetime.now()
        )
