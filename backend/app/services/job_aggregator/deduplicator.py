from typing import List, Tuple, Dict
from .types import Job


class JobDeduplicator:
    """Deduplicates jobs using company, title, location, and URL similarity"""
    
    def deduplicate(self, jobs: List[Job]) -> Tuple[List[Job], int]:
        """Simple deduplication"""
        seen: Dict[str, Job] = {}
        duplicate_count = 0
        
        for job in jobs:
            key = self._generate_key(job)
            
            if key in seen:
                duplicate_count += 1
                if self._is_more_complete(job, seen[key]):
                    seen[key] = job
            else:
                seen[key] = job
        
        return list(seen.values()), duplicate_count
    
    def deduplicate_with_similarity(self, jobs: List[Job], threshold: float = 0.85) -> Tuple[List[Job], int]:
        """Advanced deduplication with fuzzy matching"""
        unique_jobs: List[Job] = []
        duplicate_count = 0
        
        for job in jobs:
            is_duplicate = False
            
            for unique_job in unique_jobs:
                similarity = self._calculate_similarity(job, unique_job)
                
                if similarity >= threshold:
                    is_duplicate = True
                    duplicate_count += 1
                    
                    if self._is_more_complete(job, unique_job):
                        idx = unique_jobs.index(unique_job)
                        unique_jobs[idx] = job
                    break
            
            if not is_duplicate:
                unique_jobs.append(job)
        
        return unique_jobs, duplicate_count
    
    def _generate_key(self, job: Job) -> str:
        """Generate deduplication key"""
        company = self._normalize(job.company)
        title = self._normalize(job.title)
        location = self._normalize(job.location)
        return f"{company}|{title}|{location}"
    
    def _normalize(self, text: str) -> str:
        """Normalize text for comparison"""
        import re
        return re.sub(r'[^a-z0-9]', '', text.lower())
    
    def _calculate_similarity(self, job1: Job, job2: Job) -> float:
        """Calculate similarity score between two jobs"""
        score = 0.0
        
        # Company (30%)
        if self._normalize(job1.company) == self._normalize(job2.company):
            score += 0.3
        
        # Title (40%)
        title_sim = self._string_similarity(job1.title, job2.title)
        score += title_sim * 0.4
        
        # Location (20%)
        if self._normalize(job1.location) == self._normalize(job2.location):
            score += 0.2
        
        # URL (10%)
        if job1.apply_url and job2.apply_url:
            if self._normalize_url(job1.apply_url) == self._normalize_url(job2.apply_url):
                score += 0.1
        
        return score
    
    def _string_similarity(self, s1: str, s2: str) -> float:
        """Calculate string similarity"""
        s1 = self._normalize(s1)
        s2 = self._normalize(s2)
        
        if not s1 or not s2:
            return 0.0
        
        distance = self._levenshtein_distance(s1, s2)
        max_len = max(len(s1), len(s2))
        
        return 1 - (distance / max_len)
    
    def _levenshtein_distance(self, s1: str, s2: str) -> int:
        """Calculate Levenshtein distance"""
        if len(s1) < len(s2):
            return self._levenshtein_distance(s2, s1)
        
        if len(s2) == 0:
            return len(s1)
        
        previous_row = range(len(s2) + 1)
        
        for i, c1 in enumerate(s1):
            current_row = [i + 1]
            for j, c2 in enumerate(s2):
                insertions = previous_row[j + 1] + 1
                deletions = current_row[j] + 1
                substitutions = previous_row[j] + (c1 != c2)
                current_row.append(min(insertions, deletions, substitutions))
            previous_row = current_row
        
        return previous_row[-1]
    
    def _normalize_url(self, url: str) -> str:
        """Normalize URL for comparison"""
        from urllib.parse import urlparse
        try:
            parsed = urlparse(url)
            return f"{parsed.netloc}{parsed.path}".rstrip('/')
        except:
            return self._normalize(url)
    
    def _is_more_complete(self, job1: Job, job2: Job) -> bool:
        """Check if job1 has more complete data than job2"""
        score1 = 0
        score2 = 0
        
        if job1.description and len(job1.description) > 100:
            score1 += 2
        if job2.description and len(job2.description) > 100:
            score2 += 2
        
        if job1.salary:
            score1 += 1
        if job2.salary:
            score2 += 1
        
        if job1.skills and len(job1.skills) > 0:
            score1 += 1
        if job2.skills and len(job2.skills) > 0:
            score2 += 1
        
        return score1 > score2
