from typing import List
from .types import StartupJob
from .company_registry import StartupCompanyRegistry


class StartupJobNormalizer:
    """Normalizes job data from different providers"""
    
    def normalize_jobs(self, jobs: List[StartupJob]) -> List[StartupJob]:
        """Normalize a list of jobs"""
        return [self.normalize_job(job) for job in jobs]
    
    def normalize_job(self, job: StartupJob) -> StartupJob:
        """Normalize a single job"""
        
        # Normalize company name
        job.company = self._normalize_company_name(job.company)
        
        # Enrich with company profile if available
        if not job.company_profile:
            company_profile = StartupCompanyRegistry.get_company(job.company)
            if company_profile:
                job.company_profile = company_profile
                job.company_logo = job.company_logo or company_profile.logo_url
                job.startup_stage = job.startup_stage or company_profile.stage
                job.team_size = job.team_size or company_profile.team_size
                job.funding_amount = job.funding_amount or company_profile.funding_amount
                job.industries = job.industries or company_profile.industries
                job.tech_stack = job.tech_stack or company_profile.tech_stack
                job.is_yc_company = company_profile.is_yc_company
                job.is_dream_company = True
        
        # Normalize location
        job.location = self._normalize_location(job.location)
        
        # Normalize work mode
        job.work_mode = self._normalize_work_mode(job.work_mode)
        
        # Normalize employment type
        job.employment_type = self._normalize_employment_type(job.employment_type)
        
        # Normalize skills
        job.skills = self._normalize_skills(job.skills)
        
        # Set company logo if missing
        if not job.company_logo:
            job.company_logo = f"https://logo.clearbit.com/{self._get_company_domain(job.company)}"
        
        return job
    
    def _normalize_company_name(self, name: str) -> str:
        """Normalize company name"""
        # Remove common suffixes
        name = name.replace(", Inc.", "").replace(" Inc.", "")
        name = name.replace(", LLC", "").replace(" LLC", "")
        name = name.replace(", Ltd.", "").replace(" Ltd.", "")
        
        return name.strip()
    
    def _normalize_location(self, location: str) -> str:
        """Normalize location string"""
        if not location:
            return "Remote"
        
        location = location.strip()
        
        # Common patterns
        if any(word in location.lower() for word in ["remote", "anywhere", "worldwide"]):
            return "Remote"
        
        return location
    
    def _normalize_work_mode(self, work_mode: str) -> str:
        """Normalize work mode"""
        if not work_mode:
            return "remote"
        
        work_mode_lower = work_mode.lower().strip()
        
        # Map variations
        if work_mode_lower in ["remote", "fully remote", "100% remote", "remote-first"]:
            return "remote"
        elif work_mode_lower in ["hybrid", "flexible"]:
            return "hybrid"
        elif work_mode_lower in ["onsite", "on-site", "office"]:
            return "onsite"
        
        return work_mode_lower
    
    def _normalize_employment_type(self, employment_type: str) -> str:
        """Normalize employment type"""
        if not employment_type:
            return "full-time"
        
        type_lower = employment_type.lower().strip()
        
        # Map variations
        if type_lower in ["full-time", "fulltime", "full time", "ft"]:
            return "full-time"
        elif type_lower in ["part-time", "parttime", "part time", "pt"]:
            return "part-time"
        elif type_lower in ["contract", "contractor", "freelance"]:
            return "contract"
        elif type_lower in ["internship", "intern"]:
            return "internship"
        
        return type_lower
    
    def _normalize_skills(self, skills: List[str]) -> List[str]:
        """Normalize skill names"""
        if not skills:
            return []
        
        # Remove duplicates and normalize casing
        normalized = []
        seen = set()
        
        skill_map = {
            "javascript": "JavaScript",
            "typescript": "TypeScript",
            "python": "Python",
            "java": "Java",
            "golang": "Go",
            "go": "Go",
            "rust": "Rust",
            "c++": "C++",
            "react": "React",
            "vue": "Vue",
            "angular": "Angular",
            "node": "Node.js",
            "nodejs": "Node.js",
            "postgresql": "PostgreSQL",
            "postgres": "PostgreSQL",
            "mongodb": "MongoDB",
            "mongo": "MongoDB",
            "mysql": "MySQL",
            "redis": "Redis",
            "aws": "AWS",
            "azure": "Azure",
            "gcp": "GCP",
            "docker": "Docker",
            "kubernetes": "Kubernetes",
            "k8s": "Kubernetes",
        }
        
        for skill in skills:
            skill_lower = skill.lower().strip()
            normalized_skill = skill_map.get(skill_lower, skill.strip())
            
            if normalized_skill.lower() not in seen:
                normalized.append(normalized_skill)
                seen.add(normalized_skill.lower())
        
        return normalized
    
    def _get_company_domain(self, company_name: str) -> str:
        """Get company domain from name"""
        # Simple heuristic - replace spaces with empty string and add .com
        domain = company_name.lower().replace(" ", "").replace(".", "") + ".com"
        return domain
