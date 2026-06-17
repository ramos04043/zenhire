from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
import uuid
import requests as http_requests
from app.database import get_db
from app.api.deps import get_current_user, get_current_user_id
from app.models.user import User
from app.models.resume import Resume, ATSScore
from app.models.notification import Notification, NotificationType
from app.services.resume_service import ResumeService
from app.config import settings

router = APIRouter()


def _extract_user_id(request: Request) -> Optional[str]:
    """Best-effort JWT decode — never raises."""
    try:
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return None
        token = auth[7:]
        from jose import jwt as _jwt
        try:
            payload = _jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
            return str(payload.get("sub") or payload.get("user_id") or "")
        except Exception:
            from jose.jwt import get_unverified_claims
            payload = get_unverified_claims(token)
            return str(payload.get("sub") or payload.get("user_id") or "")
    except Exception:
        return None


def _save_ats_to_db(db: Session, result: dict, filename: str,
                    bucket_path: Optional[str], user_id: Optional[str]) -> dict:
    """
    Always inserts into resumes + ats_scores.
    Works with or without a logged-in user.
    Returns the saved resume UUID and ats_score UUID.
    """
    resume_id = str(uuid.uuid4())
    ats_id = str(uuid.uuid4())
    try:
        ats = result.get("ats_analysis", {})

        resume_record = Resume(
            id=resume_id,
            user_id=user_id or None,
            filename=filename,
            file_path=bucket_path or filename,
            parsed_data=result.get("parsed_data"),
            ats_score=ats.get("score"),
            status="completed",
        )
        db.add(resume_record)
        db.flush()

        ats_record = ATSScore(
            id=ats_id,
            resume_id=resume_id,
            score=float(ats.get("score") or 0),
            strengths=ats.get("strengths", []),
            weaknesses=ats.get("weaknesses", []),
            recommendations=ats.get("recommendations", []),
            keyword_analysis=ats.get("keyword_analysis", {}),
        )
        db.add(ats_record)
        db.commit()

        print(f"[upload] ✅ ats_scores insert — resume_id={resume_id} ats_id={ats_id} score={ats.get('score')} user={user_id or 'anon'}")
        return {"resume_id": resume_id, "ats_id": ats_id}
    except Exception as e:
        db.rollback()
        print(f"[upload] ❌ DB save error: {e}")
        return {}

# ---------------------------------------------------------------------------
# Request / Response models
# ---------------------------------------------------------------------------

class AnalyzeResumeRequest(BaseModel):
    file_url: Optional[str] = Field(None, description="URL of the resume file to analyze")
    text: Optional[str] = Field(None, description="Extracted text of the resume to analyze")
    file_name: Optional[str] = Field(None, description="Name of the resume file")

class AnalyzeResumeResponse(BaseModel):
    atsScore: int
    summary: str
    skills: List[str]
    experience: List[Dict]
    education: List[Dict]
    missingKeywords: List[str]
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[str]
    jobMatchScore: int


# ---------------------------------------------------------------------------
# POST /upload  — auth is optional (ZendBX JWT won't match local secret)
# ---------------------------------------------------------------------------

@router.post("/upload")
async def upload_resume(
    request: Request,
    file: UploadFile = File(...),
    bucket_path: Optional[str] = Form(None),
    db: Session = Depends(get_db),
):
    """
    Accept a multipart file upload, run Groq AI analysis, insert into
    resumes + ats_scores, return results.
    Auth is optional — anonymous uploads get a fresh UUID user_id=None.
    """
    user_id = _extract_user_id(request)
    print(f"[upload] file={file.filename} user_id={user_id or 'anonymous'}")

    try:
        ext = (file.filename or "").lower()
        if not (ext.endswith('.pdf') or ext.endswith('.docx') or ext.endswith('.txt')):
            raise HTTPException(status_code=400, detail="Only PDF, DOCX, and TXT files are supported")

        content = await file.read()
        print(f"[upload] read {len(content)} bytes")

        result = ResumeService.analyze_resume(content, file.filename)
        print("[upload] analysis complete")

        # Always persist — even without a logged-in user
        ids = _save_ats_to_db(db, result, file.filename or "resume", bucket_path, user_id)
        result.update(ids)
        result["bucket_path"] = bucket_path
        return result

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------------------------
# POST /analyze  — auth optional, accepts JSON {file_url, text, file_name}
# ---------------------------------------------------------------------------

@router.post("/analyze", response_model=AnalyzeResumeResponse)
async def analyze_resume_endpoint(
    request: AnalyzeResumeRequest,
):
    """
    Download resume from URL or accept raw text, run Groq AI, return JSON.
    No ZendBX AI calls — ZendBX is only used as file storage.
    """
    import requests as http_requests
    from app.config import settings

    try:
        filename = request.file_name or "resume.txt"
        content: bytes

        if request.file_url:
            print(f"[analyze] downloading from: {request.file_url}")
            download_headers = {k: v for k, v in {
                "apikey": settings.ZENDBX_ANON_KEY or "",
                "x-project-id": settings.ZENDBX_PROJECT_ID or "",
            }.items() if v}

            resp = http_requests.get(request.file_url, headers=download_headers, timeout=30)
            if not resp.ok:
                raise HTTPException(
                    status_code=400,
                    detail=f"Could not download resume (HTTP {resp.status_code})"
                )
            content = resp.content

        elif request.text:
            content = request.text.encode("utf-8")

        else:
            raise HTTPException(status_code=400, detail="Either file_url or text must be provided")

        return ResumeService.analyze_resume_for_api(content, filename)

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------------------------
# POST /analyze-url  — backward compat alias
# ---------------------------------------------------------------------------

@router.post("/analyze-url")
async def analyze_resume_url(
    request: AnalyzeResumeRequest,
):
    import requests as http_requests
    from app.config import settings

    try:
        if not request.file_url:
            raise HTTPException(status_code=400, detail="file_url is required")

        download_headers = {k: v for k, v in {
            "apikey": settings.ZENDBX_ANON_KEY or "",
            "x-project-id": settings.ZENDBX_PROJECT_ID or "",
        }.items() if v}

        resp = http_requests.get(request.file_url, headers=download_headers, timeout=30)
        if not resp.ok:
            raise HTTPException(status_code=400, detail=f"Could not download file (HTTP {resp.status_code})")

        return ResumeService.analyze_resume(resp.content, request.file_name or "resume.pdf")

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------------------------
# GET / and GET /{id}/ats-score  — require local DB user
# ---------------------------------------------------------------------------

@router.get("/")
def get_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Resume).filter(Resume.user_id == str(current_user.id)).all()


@router.get("/{resume_id}/ats-score")
def get_ats_score(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == str(current_user.id)
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    ats = db.query(ATSScore).filter(ATSScore.resume_id == resume_id).first()
    if not ats:
        raise HTTPException(status_code=404, detail="ATS score not found")
    return {
        "id": ats.id,
        "resume_id": ats.resume_id,
        "score": float(ats.score) if ats.score is not None else None,
        "strengths": ats.strengths or [],
        "weaknesses": ats.weaknesses or [],
        "recommendations": ats.recommendations or [],
        "keyword_analysis": ats.keyword_analysis or {},
        "created_at": ats.created_at.isoformat() if ats.created_at else None,
    }
