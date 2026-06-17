from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.models.followed_company import FollowedCompany, CompanyJobAlert
from app.models.notification import Notification
from app.services.startup_jobs.types import (
    StartupCandidateProfile,
    StartupStage,
    IndustryCategory,
    RankedStartupJob
)
from app.services.startup_jobs.startup_aggregator import StartupJobAggregator
from app.services.startup_jobs.company_registry import StartupCompanyRegistry


router = APIRouter()
aggregator = StartupJobAggregator()


@router.post("/search", response_model=dict)
async def search_startup_jobs(
    profile: StartupCandidateProfile,
    use_cache: bool = True,
    current_user: User = Depends(get_current_user)
):
    """Search for startup jobs based on candidate profile"""
    try:
        result = await aggregator.aggregate_jobs(profile, use_cache=use_cache)
        
        return {
            "jobs": [job.dict() for job in result.jobs],
            "total_jobs": result.total_jobs,
            "providers": result.providers,
            "execution_time": result.execution_time,
            "errors": result.errors,
            "cached": result.cached,
            "deduplicated_count": result.deduplicated_count,
            "startup_count": result.startup_count,
            "yc_company_count": result.yc_company_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/dream-companies", response_model=List[dict])
async def get_dream_companies(
    industry: Optional[IndustryCategory] = None,
    stage: Optional[StartupStage] = None,
    yc_only: bool = False,
    current_user: User = Depends(get_current_user)
):
    """Get list of dream companies"""
    try:
        if yc_only:
            companies = StartupCompanyRegistry.get_yc_companies()
        elif industry:
            companies = StartupCompanyRegistry.get_companies_by_industry(industry)
        else:
            companies = StartupCompanyRegistry.get_all_companies()
        
        # Filter by stage if specified
        if stage:
            companies = [c for c in companies if c.stage == stage]
        
        return [company.dict() for company in companies]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/dream-companies/{company_name}/follow")
async def follow_company(
    company_name: str,
    job_title_filter: Optional[List[str]] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Follow a dream company for job alerts"""
    try:
        # Check if company exists in registry
        company = StartupCompanyRegistry.get_company(company_name)
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")
        
        # Check if already following
        existing = db.query(FollowedCompany).filter(
            FollowedCompany.user_id == current_user.id,
            FollowedCompany.company_name == company.name
        ).first()
        
        if existing:
            return {"message": "Already following this company", "followed_company": existing}
        
        # Create followed company
        followed = FollowedCompany(
            user_id=current_user.id,
            company_name=company.name,
            company_logo=company.logo_url,
            company_website=company.website,
            notify_on_new_job=True,
            job_title_filter=job_title_filter or []
        )
        
        db.add(followed)
        db.commit()
        db.refresh(followed)
        
        return {"message": f"Now following {company.name}", "followed_company": followed}
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/dream-companies/{company_name}/unfollow")
async def unfollow_company(
    company_name: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Unfollow a dream company"""
    try:
        followed = db.query(FollowedCompany).filter(
            FollowedCompany.user_id == current_user.id,
            FollowedCompany.company_name == company_name
        ).first()
        
        if not followed:
            raise HTTPException(status_code=404, detail="Not following this company")
        
        db.delete(followed)
        db.commit()
        
        return {"message": f"Unfollowed {company_name}"}
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/dream-companies/following", response_model=List[dict])
async def get_followed_companies(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get list of companies user is following"""
    followed_companies = db.query(FollowedCompany).filter(
        FollowedCompany.user_id == current_user.id
    ).all()
    
    return [
        {
            "id": fc.id,
            "company_name": fc.company_name,
            "company_logo": fc.company_logo,
            "company_website": fc.company_website,
            "notify_on_new_job": fc.notify_on_new_job,
            "job_title_filter": fc.job_title_filter,
            "followed_at": fc.followed_at
        }
        for fc in followed_companies
    ]


@router.get("/dream-companies/jobs")
async def get_dream_company_jobs(
    company_names: List[str] = Query(...),
    profile: StartupCandidateProfile = None,
    current_user: User = Depends(get_current_user)
):
    """Get jobs from specific dream companies"""
    try:
        if not profile:
            # Create default profile
            profile = StartupCandidateProfile(
                desired_job_title="Software Engineer",
                skills=[],
                experience_level="mid",
                preferred_locations=["Remote"],
                work_mode="remote"
            )
        
        jobs = await aggregator.get_dream_company_jobs(profile, company_names)
        
        return {
            "jobs": [job.dict() for job in jobs],
            "total_jobs": len(jobs)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/alerts", response_model=List[dict])
async def get_job_alerts(
    unread_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get job alerts for followed companies"""
    query = db.query(CompanyJobAlert).filter(
        CompanyJobAlert.user_id == current_user.id
    )
    
    if unread_only:
        query = query.filter(CompanyJobAlert.is_read == False)
    
    alerts = query.order_by(CompanyJobAlert.created_at.desc()).limit(50).all()
    
    return [
        {
            "id": alert.id,
            "job_title": alert.job_title,
            "company_name": alert.company_name,
            "job_url": alert.job_url,
            "is_read": alert.is_read,
            "created_at": alert.created_at,
            "read_at": alert.read_at
        }
        for alert in alerts
    ]


@router.post("/alerts/{alert_id}/read")
async def mark_alert_as_read(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark a job alert as read"""
    alert = db.query(CompanyJobAlert).filter(
        CompanyJobAlert.id == alert_id,
        CompanyJobAlert.user_id == current_user.id
    ).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.is_read = True
    alert.read_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": "Alert marked as read"}


@router.get("/industries", response_model=List[str])
async def get_industries():
    """Get list of available industries"""
    return [industry.value for industry in IndustryCategory]


@router.get("/stages", response_model=List[str])
async def get_startup_stages():
    """Get list of startup stages"""
    return [stage.value for stage in StartupStage]
