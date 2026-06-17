import re
import uuid
from typing import Dict, Any, List, Optional, Union
from .types import Job


class JobNormalizer:
    """Normalizes raw job data from different providers into a unified format"""
    
    def normalize(self, raw_job: Dict[str, Any], provider: str) -> Job:
        """Normalize a raw job from a provider"""
        job_id = f"{provider}-{raw_job.get('id', uuid.uuid4())}"
        
        return Job(
            id=job_id,
            provider=provider,
            external_id=str(raw_job.get('id', job_id)),
            title=self._normalize_title(raw_job.get('title', '')),
            company=self._normalize_company(raw_job.get('company', '')),
            company_logo=raw_job.get('company_logo') or self._get_default_logo(raw_job.get('company', '')),
            location=self._normalize_location(raw_job.get('location')),
            country=raw_job.get('country') or self._extract_country(raw_job.get('location')),
            salary=self._normalize_salary(raw_job.get('salary')),
            employment_type=self._normalize_employment_type(raw_job.get('employment_type')),
            work_mode=self._normalize_work_mode(raw_job.get('work_mode') or raw_job.get('location', '')),
            description=self._normalize_description(raw_job.get('description', '')),
            skills=self._extract_skills(raw_job),
            apply_url=raw_job.get('apply_url', ''),
            posted_date=raw_job.get('posted_date'),
            source=provider
        )
    
    def _normalize_title(self, title: str) -> str:
        return title.strip() if title else 'Untitled Position'
    
    def _normalize_company(self, company: str) -> str:
        return company.strip() if company else 'Unknown Company'
    
    def _normalize_location(self, location: Optional[str]) -> str:
        if not location:
            return 'Remote'
        if 'remote' in location.lower():
            return 'Remote'
        return location.strip()
    
    def _extract_country(self, location: Optional[str]) -> str:
        if not location:
            return 'Global'
        
        patterns = {
            'United States': r'\b(USA|US|United States|America)\b',
            'United Kingdom': r'\b(UK|United Kingdom|Britain)\b',
            'Canada': r'\bCanada\b',
            'Remote': r'\bRemote\b',
        }
        
        for country, pattern in patterns.items():
            if re.search(pattern, location, re.IGNORECASE):
                return country
        
        return 'Global'
    
    def _normalize_salary(self, salary: Union[str, int, None]) -> str:
        if not salary:
            return ''
        if isinstance(salary, int):
            return f"${salary:,}"
        return str(salary).strip()
    
    def _normalize_employment_type(self, emp_type: Optional[str]) -> str:
        if not emp_type:
            return 'full-time'
        
        t = emp_type.lower()
        if 'full' in t or 'permanent' in t:
            return 'full-time'
        if 'part' in t:
            return 'part-time'
        if 'contract' in t or 'freelance' in t:
            return 'contract'
        
        return 'full-time'
    
    def _normalize_work_mode(self, text: str) -> str:
        if not text:
            return 'remote'
        
        t = text.lower()
        if 'remote' in t or 'wfh' in t:
            return 'remote'
        if 'hybrid' in t:
            return 'hybrid'
        if 'onsite' in t or 'office' in t:
            return 'onsite'
        
        return 'remote'
    
    def _normalize_description(self, description: str) -> str:
        if not description:
            return 'No description available.'
        
        # Remove HTML tags
        clean = re.sub(r'<[^>]+>', '', description)
        clean = re.sub(r'\s+', ' ', clean).strip()
        return clean[:2000]
    
    def _extract_skills(self, raw_job: Dict[str, Any]) -> List[str]:
        skills = set()
        
        # Direct skills field
        if 'skills' in raw_job and raw_job['skills']:
            if isinstance(raw_job['skills'], list):
                skills.update(str(s).strip() for s in raw_job['skills'])
            else:
                skills.add(str(raw_job['skills']).strip())
        
        # Tags
        if 'tags' in raw_job and isinstance(raw_job['tags'], list):
            skills.update(str(t).strip() for t in raw_job['tags'])
        
        return list(skills)[:20]
    
    def _get_default_logo(self, company: str) -> str:
        return f"https://ui-avatars.com/api/?name={company}&background=random&size=128"
