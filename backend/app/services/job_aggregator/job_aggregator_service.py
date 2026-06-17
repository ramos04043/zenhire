import asyncio
import time
import json
import logging
from typing import List, Dict, Any, Optional

from .types import CandidateProfile, Job, RankedJob, AggregationResult, ProviderResult
from .normalizer import JobNormalizer
from .deduplicator import JobDeduplicator
from .ranking import JobRanker

logger = logging.getLogger(__name__)

try:
    from .providers.internshala_provider import InternshalaProvider
    from .providers.naukri_provider import NaukriProvider
    from .providers.linkedin_india_provider import LinkedInIndiaProvider
except ImportError as e:
    logger.warning("Provider import failed: %s", e)


class JobAggregatorService:
    """Aggregates jobs from LinkedIn, Internshala and Naukri in parallel."""

    def __init__(self):
        self.providers = [
            LinkedInIndiaProvider(),
            InternshalaProvider(),
            NaukriProvider(),
        ]
        self.deduplicator = JobDeduplicator()
        self.ranker = JobRanker()
        self.cache: Dict[str, Dict[str, Any]] = {}
        self.cache_ttl = 15 * 60  # 15 minutes

    async def search_jobs(self, profile: CandidateProfile) -> AggregationResult:
        start_time = time.time()

        cache_key = self._generate_cache_key(profile)
        cached = self._get_from_cache(cache_key)
        if cached:
            cached['cached'] = True
            return AggregationResult(**cached)

        logger.info("Job search: %s", profile.desired_job_title)

        provider_results = await self._execute_providers(profile)
        all_jobs = self._merge_results(provider_results)

        unique_jobs, duplicate_count = self.deduplicator.deduplicate_with_similarity(all_jobs, 0.85)
        ranked_jobs = self.ranker.rank(unique_jobs, profile)

        execution_time = (time.time() - start_time) * 1000

        result = AggregationResult(
            jobs=ranked_jobs,
            total_jobs=len(ranked_jobs),
            providers=[r.provider for r in provider_results],
            execution_time=execution_time,
            errors=self._extract_errors(provider_results),
            cached=False,
            deduplicated_count=duplicate_count,
        )

        self._save_to_cache(cache_key, result.dict())
        logger.info(
            "Search done: %d jobs in %.0fms (-%d dupes)",
            len(ranked_jobs), execution_time, duplicate_count,
        )
        return result

    async def _execute_providers(self, profile: CandidateProfile) -> List[ProviderResult]:
        tasks = [self._execute_provider(p, profile) for p in self.providers]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        out = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                name = self.providers[i].name
                logger.error("[%s] failed: %s", name, result)
                out.append(ProviderResult(provider=name, jobs=[], execution_time=0, error=str(result)))
            else:
                out.append(result)
        return out

    async def _execute_provider(self, provider, profile: CandidateProfile) -> ProviderResult:
        start = time.time()
        try:
            jobs = await provider.search_jobs(profile)
            ms = (time.time() - start) * 1000
            logger.info("[%s] %d jobs in %.0fms", provider.name, len(jobs), ms)
            return ProviderResult(provider=provider.name, jobs=jobs, execution_time=ms)
        except Exception as e:
            ms = (time.time() - start) * 1000
            logger.error("[%s] error: %s", provider.name, e)
            return ProviderResult(provider=provider.name, jobs=[], execution_time=ms, error=str(e))

    def _merge_results(self, provider_results: List[ProviderResult]) -> List[Job]:
        jobs = []
        for r in provider_results:
            jobs.extend(r.jobs)
        return jobs

    def _extract_errors(self, provider_results: List[ProviderResult]) -> Dict[str, str]:
        return {r.provider: r.error for r in provider_results if r.error}

    def _generate_cache_key(self, profile: CandidateProfile) -> str:
        return json.dumps({
            'title': profile.desired_job_title,
            'skills': profile.skills[:5],
            'locations': profile.preferred_locations,
            'work_mode': profile.work_mode,
        }, sort_keys=True)

    def _get_from_cache(self, key: str) -> Optional[Dict[str, Any]]:
        if key not in self.cache:
            return None
        cached = self.cache[key]
        if time.time() - cached['timestamp'] > self.cache_ttl:
            del self.cache[key]
            return None
        return cached['data']

    def _save_to_cache(self, key: str, data: Dict[str, Any]) -> None:
        self.cache[key] = {'data': data, 'timestamp': time.time()}
        if len(self.cache) > 100:
            oldest = next(iter(self.cache))
            del self.cache[oldest]

    def clear_cache(self) -> None:
        self.cache.clear()

    def get_cache_stats(self) -> Dict[str, Any]:
        return {'size': len(self.cache), 'ttl': self.cache_ttl}
