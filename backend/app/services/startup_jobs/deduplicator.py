from typing import List, Set, Tuple
from difflib import SequenceMatcher
from .types import StartupJob


class StartupJobDeduplicator:
    """Deduplicates startup jobs from multiple sources"""
    
    def deduplicate(self, jobs: List[StartupJob]) -> List[StartupJob]:
        """Remove duplicate jobs"""
        if not jobs:
            return []
        
        unique_jobs: List[StartupJob] = []
        seen_signatures: Set[str] = set()
        
        for job in jobs:
            signature = self._get_job_signature(job)
            
            if signature not in seen_signatures:
                # Check for similar jobs
                if not self._has_similar_job(job, unique_jobs):
                    unique_jobs.append(job)
                    seen_signatures.add(signature)
        
        return unique_jobs
    
    def _get_job_signature(self, job: StartupJob) -> str:
        """Generate unique signature for a job"""
        # Normalize company and title
        company = job.company.lower().strip()
        title = job.title.lower().strip()
        location = job.location.lower().strip()
        
        return f"{company}|{title}|{location}"
    
    def _has_similar_job(self, job: StartupJob, existing_jobs: List[StartupJob]) -> bool:
        """Check if a similar job already exists"""
        for existing in existing_jobs:
            if self._are_jobs_similar(job, existing):
                return True
        return False
    
    def _are_jobs_similar(self, job1: StartupJob, job2: StartupJob) -> bool:
        """Check if two jobs are similar enough to be considered duplicates"""
        
        # Same company
        if job1.company.lower() != job2.company.lower():
            return False
        
        # Similar title (using fuzzy matching)
        title_similarity = self._calculate_similarity(
            job1.title.lower(), 
            job2.title.lower()
        )
        
        if title_similarity > 0.85:
            return True
        
        # Same location and very similar title
        if (job1.location.lower() == job2.location.lower() and 
            title_similarity > 0.75):
            return True
        
        return False
    
    def _calculate_similarity(self, str1: str, str2: str) -> float:
        """Calculate similarity between two strings"""
        return SequenceMatcher(None, str1, str2).ratio()
