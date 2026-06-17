import random
from typing import List, Dict
from sqlalchemy.orm import Session
from app.models.job import Job, SavedJob

class JobService:
    @staticmethod
    def generate_mock_jobs(db: Session, count: int = 20) -> List[Job]:
        """Generate mock jobs for demo"""
        companies = ["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Tesla", "SpaceX", "Stripe", "Airbnb"]
        positions = ["Software Engineer", "Senior Software Engineer", "Full Stack Developer", "Backend Engineer", "Frontend Engineer", "DevOps Engineer"]
        locations = ["San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX", "Remote", "Boston, MA"]
        
        skills_pool = [
            "Python", "JavaScript", "TypeScript", "React", "Node.js", "FastAPI", 
            "Docker", "Kubernetes", "AWS", "GCP", "SQL", "PostgreSQL", "MongoDB",
            "Git", "CI/CD", "Microservices", "REST APIs", "GraphQL"
        ]
        
        jobs = []
        for i in range(count):
            required_skills = random.sample(skills_pool, k=random.randint(5, 10))
            
            job = Job(
                title=random.choice(positions),
                company=random.choice(companies),
                location=random.choice(locations),
                salary_min=random.randint(80, 150) * 1000,
                salary_max=random.randint(150, 250) * 1000,
                description=f"We are looking for a talented engineer to join our team...",
                required_skills=required_skills,
                job_type=random.choice(["Full-time", "Contract", "Remote"]),
                experience_level=random.choice(["Mid-level", "Senior", "Lead"])
            )
            jobs.append(job)
        
        db.add_all(jobs)
        db.commit()
        return jobs
    
    @staticmethod
    def calculate_match_score(user_skills: List[str], job_skills: List[str]) -> Dict:
        """Calculate job match score"""
        user_skills_set = set(skill.lower() for skill in user_skills)
        job_skills_set = set(skill.lower() for skill in job_skills)
        
        matching = list(user_skills_set & job_skills_set)
        missing = list(job_skills_set - user_skills_set)
        
        if len(job_skills_set) > 0:
            score = (len(matching) / len(job_skills_set)) * 100
        else:
            score = 0
        
        return {
            "score": round(score, 1),
            "matching_skills": matching,
            "missing_skills": missing
        }
