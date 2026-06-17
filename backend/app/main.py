from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import traceback
import sys
from app.api.routes import auth as auth_router, users as users_router, resumes as resumes_router, applications as applications_router, jobs as jobs_router, notifications as notifications_router, settings as settings_router
from app.api.routes import optimize as optimize_router, jobs_v2 as jobs_v2_router, startup_jobs as startup_jobs_router
from app.api.routes import cover_letter as cover_letter_router, interview_prep as interview_prep_router
from app.database import engine, Base
from app import models # Import models to ensure they are registered

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ZenHire API", version="1.0.0")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "detail": str(exc),
            "traceback": traceback.format_exc(),
            "type": type(exc).__name__
        }
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router, prefix="/api/auth", tags=["auth"])
app.include_router(users_router.router, prefix="/api/users", tags=["users"])
app.include_router(resumes_router.router, prefix="/api/resumes", tags=["resumes"])
app.include_router(applications_router.router, prefix="/api/applications", tags=["applications"])
app.include_router(jobs_router.router, prefix="/api/jobs", tags=["jobs"])
app.include_router(jobs_v2_router.router, prefix="/api/jobs", tags=["jobs-v2"])
app.include_router(notifications_router.router, prefix="/api/notifications", tags=["notifications"])
app.include_router(settings_router.router, prefix="/api/settings", tags=["settings"])
app.include_router(optimize_router.router, prefix="/api/optimize", tags=["optimization"])
app.include_router(startup_jobs_router.router, prefix="/api/startup-jobs", tags=["startup-jobs"])
app.include_router(cover_letter_router.router, prefix="/api/cover-letter", tags=["cover-letter"])
app.include_router(interview_prep_router.router, prefix="/api/interview-prep", tags=["interview-prep"])

@app.get("/routes")
def get_routes():
    return [{"path": route.path, "name": route.name, "methods": list(route.methods) if hasattr(route, 'methods') else []} for route in app.routes]

@app.get("/")
def read_root():
    return {"message": "ZenHire API", "version": "1.0.0"}

@app.get("/health")
def health_check():
    try:
        # Test DB connection
        from sqlalchemy import text
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected",
            "environment": {
                "python_version": sys.version,
                "platform": sys.platform,
            }
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "traceback": traceback.format_exc()
        }
