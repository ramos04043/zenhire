import asyncio
from typing import List, Dict
import time
from .types import (
    StartupCandidateProfile, 
    StartupJob, 
    RankedStartupJob, 
    ProviderResult,
    StartupAggregationResult
)
from .providers import (
    YCombinatorProvider,
    WellfoundProvider,
    RemoteOKProvider,
    WeWorkRemotelyProvider,
    CompanyScraperProvider
)
from .ranking import StartupJobRanker
from .deduplicator import StartupJobDeduplicator
from .normalizer import StartupJobNormalizer


class StartupJobAggregator:
    """Aggregates startup jobs from multiple sources"""
    
    def __init__(self):
        self.providers = [
            YCombinatorProvider(),
            WellfoundProvider(),
            RemoteOKProvider(),
            WeWorkRemotelyProvider(),
            CompanyScraperProvider()
        ]
        self.ranker = StartupJobRanker()
        self.deduplicator = StartupJobDeduplicator()
        self.normalizer = StartupJobNormalizer()
        self.cache: Dict[str, StartupAggregationResult] = {}
        self.cache_ttl = 3600  # 1 hour
    
    async def aggregate_jobs(
        self, 
        profile: StartupCandidateProfile,
        use_cache: bool = True
    ) -> StartupAggregationResult:
        """Aggregate startup jobs from all providers"""
        
        start_time = time.time()
        cache_key = self._get_cache_key(profile)
        
        # Check cache
        if use_cache and cache_key in self.cache:
            cached_result = self.cache[cache_key]
            if time.time() - cached_result.execution_time < self.cache_ttl:
                return cached_result
        
        # Fetch jobs from all providers in parallel
        tasks = [
            self._fetch_from_provider(provider, profile)
            for provider in self.providers
        ]
        
        provider_results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Collect all jobs and errors
        all_jobs: List[StartupJob] = []
        errors: Dict[str, str] = {}
        providers_used: List[str] = []
        
        for result in provider_results:
            if isinstance(result, Exception):
                errors["unknown"] = str(result)
                continue
            
            if isinstance(result, ProviderResult):
                providers_used.append(result.provider)
                all_jobs.extend(result.jobs)
                
                if result.error:
                    errors[result.provider] = result.error
        
        # Normalize jobs
        normalized_jobs = self.normalizer.normalize_jobs(all_jobs)
        
        # Deduplicate
        unique_jobs = self.deduplicator.deduplicate(normalized_jobs)
        deduplicated_count = len(normalized_jobs) - len(unique_jobs)
        
        # Rank jobs
        ranked_jobs = self.ranker.rank_jobs(unique_jobs, profile)
        
        # Calculate stats
        yc_count = sum(1 for job in ranked_jobs if job.is_yc_company)
        startup_count = len(set(job.company for job in ranked_jobs))
        
        execution_time = time.time() - start_time
        
        result = StartupAggregationResult(
            jobs=ranked_jobs,
            total_jobs=len(ranked_jobs),
            providers=providers_used,
            execution_time=execution_time,
            errors=errors,
            cached=False,
            deduplicated_count=deduplicated_count,
            startup_count=startup_count,
            yc_company_count=yc_count
        )
        
        # Cache result
        self.cache[cache_key] = result
        
        return result
    
    async def _fetch_from_provider(
        self, 
        provider, 
        profile: StartupCandidateProfile
    ) -> ProviderResult:
        """Fetch jobs from a single provider"""
        start_time = time.time()
        
        try:
            jobs = await provider.search_jobs(profile)
            execution_time = time.time() - start_time
            
            return ProviderResult(
                provider=provider.name,
                jobs=jobs,
                execution_time=execution_time,
                error=None
            )
        except Exception as e:
            execution_time = time.time() - start_time
            
            return ProviderResult(
                provider=provider.name,
                jobs=[],
                execution_time=execution_time,
                error=str(e)
            )
    
    def _get_cache_key(self, profile: StartupCandidateProfile) -> str:
        """Generate cache key from profile"""
        return f"{profile.desired_job_title}_{profile.work_mode}_{','.join(profile.preferred_locations[:3])}"
    
    async def get_dream_company_jobs(
        self,
        profile: StartupCandidateProfile,
        company_names: List[str]
    ) -> List[RankedStartupJob]:
        """Get jobs from specific dream companies"""
        
        # Use company scraper provider
        scraper = CompanyScraperProvider()
        all_jobs = await scraper.search_jobs(profile)
        
        # Filter by requested companies
        filtered_jobs = [
            job for job in all_jobs
            if job.company.lower() in [name.lower() for name in company_names]
        ]
        
        # Normalize and rank
        normalized = self.normalizer.normalize_jobs(filtered_jobs)
        ranked = self.ranker.rank_jobs(normalized, profile)
        
        return ranked
    
    async def close(self):
        """Close all provider connections"""
        for provider in self.providers:
            await provider.close()
