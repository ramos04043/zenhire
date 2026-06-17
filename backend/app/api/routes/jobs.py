from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.job import Job, SavedJob
from app.models.resume import Resume
from app.models.notification import Notification, NotificationType
from app.services.job_service import JobService
from app.services.job_scraper import search_jobs

router = APIRouter()


class JobSearchRequest(BaseModel):
    role: str
    location: str = "Remote"
    job_type: str = "full-time"
    experience_level: str = "mid"
    max_results: int = 15
    include_linkedin: bool = True
    include_indeed: bool = True


@router.post("/search")
def search_jobs_endpoint(body: JobSearchRequest):
    """Scrape live jobs from multiple sources including LinkedIn and Indeed."""
    from app.config import settings
    
    print(f"[jobs/search] Searching for '{body.role}' in '{body.location}' (LinkedIn: {body.include_linkedin}, Indeed: {body.include_indeed})")
    
    results = search_jobs(
        role=body.role,
        location=body.location,
        job_type=body.job_type,
        experience_level=body.experience_level,
        max_results=body.max_results,
        jooble_api_key=getattr(settings, 'JOOBLE_API_KEY', '') or '',
        include_linkedin=body.include_linkedin,
        include_indeed=body.include_indeed,
    )
    
    # Add source breakdown for debugging
    sources = {}
    for job in results:
        source = job.get('source', 'Unknown')
        sources[source] = sources.get(source, 0) + 1
    
    return {
        "jobs": results, 
        "count": len(results),
        "sources": sources,
        "search_params": {
            "role": body.role,
            "location": body.location,
            "linkedin_enabled": body.include_linkedin,
            "indeed_enabled": body.include_indeed
        }
    }



@router.get("/discover")
def discover_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    jobs = db.query(Job).limit(20).all()
    
    if not jobs:
        jobs = JobService.generate_mock_jobs(db, count=20)
    
    primary_resume = db.query(Resume).filter(
        Resume.user_id == current_user.id,
        Resume.is_primary == 1
    ).first()
    
    user_skills = []
    if primary_resume and primary_resume.parsed_data:
        user_skills = primary_resume.parsed_data.get("skills", [])
    
    job_list = []
    for job in jobs:
        match_data = JobService.calculate_match_score(user_skills, job.required_skills)
        job_list.append({
            "id": job.id,
            "title": job.title,
            "company": job.company,
            "location": job.location,
            "salary_min": job.salary_min,
            "salary_max": job.salary_max,
            "required_skills": job.required_skills,
            "job_type": job.job_type,
            "experience_level": job.experience_level,
            "match_score": match_data["score"],
            "matching_skills": match_data["matching_skills"],
            "missing_skills": match_data["missing_skills"]
        })
    
    job_list.sort(key=lambda x: x["match_score"], reverse=True)
    
    return job_list

@router.post("/{job_id}/save")
def save_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(SavedJob).filter(
        SavedJob.user_id == current_user.id,
        SavedJob.job_id == job_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Job already saved")
    
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    primary_resume = db.query(Resume).filter(
        Resume.user_id == current_user.id,
        Resume.is_primary == 1
    ).first()
    
    user_skills = []
    if primary_resume and primary_resume.parsed_data:
        user_skills = primary_resume.parsed_data.get("skills", [])
    
    match_data = JobService.calculate_match_score(user_skills, job.required_skills)
    
    saved_job = SavedJob(
        user_id=current_user.id,
        job_id=job_id,
        match_score=match_data["score"],
        matching_skills=match_data["matching_skills"],
        missing_skills=match_data["missing_skills"]
    )
    db.add(saved_job)
    
    notification = Notification(
        user_id=current_user.id,
        type=NotificationType.JOB_SAVED,
        title="Job Saved",
        message=f"You saved {job.title} at {job.company}"
    )
    db.add(notification)
    
    db.commit()
    db.refresh(saved_job)
    
    return {"message": "Job saved successfully", "saved_job": saved_job}

@router.get("/saved")
def get_saved_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    saved_jobs = db.query(SavedJob).filter(SavedJob.user_id == current_user.id).all()
    return saved_jobs

@router.delete("/saved/{saved_job_id}")
def remove_saved_job(
    saved_job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    saved_job = db.query(SavedJob).filter(
        SavedJob.id == saved_job_id,
        SavedJob.user_id == current_user.id
    ).first()
    
    if not saved_job:
        raise HTTPException(status_code=404, detail="Saved job not found")
    
    db.delete(saved_job)
    db.commit()
    
    return {"message": "Job removed successfully"}

@router.get("/test-scraping")
def test_scraping(
    role: str = Query(default="software engineer", description="Job role to search for"),
    location: str = Query(default="Remote", description="Location to search in")
):
    """Test endpoint to quickly check LinkedIn and Indeed scraping."""
    from app.services.job_scraper import fetch_linkedin, fetch_indeed
    
    print(f"[test-scraping] Testing LinkedIn and Indeed for '{role}' in '{location}'")
    
    results = {
        "query": {"role": role, "location": location},
        "linkedin": [],
        "indeed": [],
        "status": "success"
    }
    
    try:
        # Test LinkedIn
        linkedin_jobs = fetch_linkedin(role, location, max_results=5)
        results["linkedin"] = linkedin_jobs
        print(f"[test-scraping] LinkedIn returned {len(linkedin_jobs)} jobs")
    except Exception as e:
        results["linkedin_error"] = str(e)
        print(f"[test-scraping] LinkedIn error: {e}")
    
    try:
        # Test Indeed
        indeed_jobs = fetch_indeed(role, location, max_results=5)
        results["indeed"] = indeed_jobs
        print(f"[test-scraping] Indeed returned {len(indeed_jobs)} jobs")
    except Exception as e:
        results["indeed_error"] = str(e)
        print(f"[test-scraping] Indeed error: {e}")
    
    return results