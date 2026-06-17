"""
New Job Aggregation API endpoints
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import asyncio

from app.services.job_aggregator.job_aggregator_service import JobAggregatorService
from app.services.job_aggregator.types import CandidateProfile

router = APIRouter()
aggregator = JobAggregatorService()


class JobSearchRequest(BaseModel):
    """Job search request from frontend"""
    role: str
    location: Optional[str] = "Remote"
    skills: Optional[List[str]] = []
    experience_level: Optional[str] = "mid"
    work_mode: Optional[str] = "remote"
    employment_type: Optional[str] = "full-time"
    max_results: Optional[int] = 50


@router.post("/search-aggregated")
async def search_aggregated_jobs(request: JobSearchRequest):
    """
    Search jobs using the new aggregation engine.
    Replaces the old /jobs/search endpoint.
    """
    try:
        # Convert frontend request to CandidateProfile
        profile = CandidateProfile(
            desired_job_title=request.role,
            skills=request.skills or [],
            experience_level=request.experience_level or "mid",
            preferred_locations=[request.location] if request.location else ["Remote"],
            work_mode=request.work_mode or "remote",
            employment_type=request.employment_type or "full-time"
        )
        
        # Execute aggregation
        result = await aggregator.search_jobs(profile)
        
        # Transform to frontend format
        jobs = []
        for ranked_job in result.jobs[:request.max_results]:
            jobs.append({
                "id": ranked_job.id,
                "title": ranked_job.title,
                "company": ranked_job.company,
                "location": ranked_job.location,
                "salary": ranked_job.salary,
                "summary": ranked_job.description[:200] + "..." if len(ranked_job.description) > 200 else ranked_job.description,
                "url": ranked_job.apply_url,
                "source": ranked_job.provider,
                "matchScore": ranked_job.match_score,
                "matchingSkills": ranked_job.matching_skills,
                "missingSkills": ranked_job.missing_skills,
                "matchReasons": ranked_job.match_reason,
                "companyLogo": ranked_job.company_logo,
                "workMode": ranked_job.work_mode,
                "employmentType": ranked_job.employment_type,
                "postedDate": ranked_job.posted_date,
            })
        
        return {
            "jobs": jobs,
            "total": result.total_jobs,
            "providers": result.providers,
            "execution_time_ms": result.execution_time,
            "deduplicated_count": result.deduplicated_count,
            "cached": result.cached,
            "errors": result.errors
        }
        
    except Exception as e:
        import traceback
        print(f"[Jobs API] Error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/clear-cache")
async def clear_job_cache():
    """Clear the job aggregation cache"""
    aggregator.clear_cache()
    return {"message": "Cache cleared successfully"}


@router.get("/cache-stats")
async def get_cache_stats():
    """Get cache statistics"""
    return aggregator.get_cache_stats()
