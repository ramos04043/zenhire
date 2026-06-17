from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from app.database import get_db
from app.models.resume_version import ResumeVersion
from app.services.optimization_service import optimize_resume

router = APIRouter()


class OptimizeRequest(BaseModel):
    parsed_resume: dict
    ats_analysis: dict
    job_title: str
    company_name: str
    job_description: str
    job_id: Optional[str] = None
    resume_id: Optional[str] = None
    user_id: Optional[str] = None


class VersionListItem(BaseModel):
    id: int
    company_name: Optional[str]
    job_title: Optional[str]
    ats_before: Optional[float]
    ats_after: Optional[float]
    added_keywords: Optional[List[str]]
    created_at: str


@router.post("/optimize")
async def optimize_resume_endpoint(body: OptimizeRequest, db: Session = Depends(get_db)):
    """
    Optimize a resume for a specific job using Groq AI.
    Never overwrites original — always creates a new version.
    
    Returns structured optimization with before/after ATS scores,
    keyword changes, and full optimized resume markdown.
    """
    try:
        result = optimize_resume(
            parsed_resume=body.parsed_resume,
            ats_analysis=body.ats_analysis,
            job_title=body.job_title,
            company_name=body.company_name,
            job_description=body.job_description,
        )
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        import traceback
        print(f"[optimize] error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Optimization failed: {str(e)}")

    # Persist version to DB
    try:
        version = ResumeVersion(
            user_id=body.user_id or "anonymous",
            resume_id=body.resume_id,
            job_id=body.job_id,
            company_name=body.company_name,
            job_title=body.job_title,
            ats_before=float(result.get("atsBefore", 70)),
            ats_after=float(result.get("atsAfter", 75)),
            added_keywords=result.get("addedKeywords", []),
            missing_keywords=result.get("missingKeywords", []),
            changes=result.get("changes", []),
            strengths=result.get("strengths", []),
            remaining_weaknesses=result.get("remainingWeaknesses", []),
            optimized_summary=result.get("optimizedSummary"),
            optimized_experience=result.get("optimizedExperience", []),
            optimized_projects=result.get("optimizedProjects", []),
            optimized_skills=result.get("optimizedSkills", []),
            optimized_resume_markdown=result.get("optimizedResumeMarkdown"),
            original_parsed_data=body.parsed_resume,
            optimization_metadata={
                "ai_provider": "groq",
                "model": "llama-3.3-70b-versatile",
                "target_job": f"{body.job_title} @ {body.company_name}",
            },
        )
        db.add(version)
        db.commit()
        db.refresh(version)
        result["version_id"] = version.id
        result["optimizedResumeMarkdown"] = result.get("optimizedResumeMarkdown", "")
        print(f"[optimize] saved version id={version.id} for user={body.user_id}")
    except Exception as e:
        db.rollback()
        print(f"[optimize] DB save error (non-fatal): {e}")
        # Still return result even if DB save fails

    return result


@router.get("/versions/{user_id}")
def get_versions(user_id: str, db: Session = Depends(get_db)):
    """List all optimization versions for a user, newest first."""
    versions = (
        db.query(ResumeVersion)
        .filter(ResumeVersion.user_id == user_id)
        .order_by(ResumeVersion.created_at.desc())
        .all()
    )
    return [
        {
            "id": v.id,
            "company_name": v.company_name,
            "job_title": v.job_title,
            "ats_before": v.ats_before,
            "ats_after": v.ats_after,
            "added_keywords": v.added_keywords or [],
            "missing_keywords": v.missing_keywords or [],
            "changes": v.changes or [],
            "strengths": v.strengths or [],
            "remaining_weaknesses": v.remaining_weaknesses or [],
            "optimized_summary": v.optimized_summary,
            "optimized_experience": v.optimized_experience or [],
            "optimized_projects": v.optimized_projects or [],
            "optimized_skills": v.optimized_skills or [],
            "optimized_resume_markdown": v.optimized_resume_markdown or "",
            "optimized_resume_html": v.optimized_resume_html or "",
            "created_at": v.created_at.isoformat() if v.created_at else "",
        }
        for v in versions
    ]


@router.get("/versions/{user_id}/{version_id}")
def get_version(user_id: str, version_id: int, db: Session = Depends(get_db)):
    """Get a single optimization version."""
    v = db.query(ResumeVersion).filter(
        ResumeVersion.id == version_id,
        ResumeVersion.user_id == user_id,
    ).first()
    if not v:
        raise HTTPException(status_code=404, detail="Version not found")
    return {
        "id": v.id,
        "company_name": v.company_name,
        "job_title": v.job_title,
        "ats_before": v.ats_before,
        "ats_after": v.ats_after,
        "added_keywords": v.added_keywords or [],
        "missing_keywords": v.missing_keywords or [],
        "changes": v.changes or [],
        "strengths": v.strengths or [],
        "remaining_weaknesses": v.remaining_weaknesses or [],
        "optimized_summary": v.optimized_summary,
        "optimized_experience": v.optimized_experience or [],
        "optimized_skills": v.optimized_skills or [],
        "optimized_resume_markdown": v.optimized_resume_markdown,
        "original_parsed_data": v.original_parsed_data,
        "created_at": v.created_at.isoformat() if v.created_at else "",
    }


@router.delete("/versions/{user_id}/{version_id}")
def delete_version(user_id: str, version_id: int, db: Session = Depends(get_db)):
    v = db.query(ResumeVersion).filter(
        ResumeVersion.id == version_id,
        ResumeVersion.user_id == user_id,
    ).first()
    if not v:
        raise HTTPException(status_code=404, detail="Version not found")
    db.delete(v)
    db.commit()
    return {"message": "Deleted"}
