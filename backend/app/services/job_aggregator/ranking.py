from typing import List, Dict, Tuple, Optional
import re
from .types import Job, RankedJob, CandidateProfile


class JobRanker:
    """AI-powered job ranking based on candidate profile matching"""
    
    def rank(self, jobs: List[Job], profile: CandidateProfile) -> List[RankedJob]:
        """Rank jobs by match score"""
        ranked = [self._rank_job(job, profile) for job in jobs]
        return sorted(ranked, key=lambda x: x.match_score, reverse=True)
    
    def _rank_job(self, job: Job, profile: CandidateProfile) -> RankedJob:
        """Calculate match score for a single job"""
        skill_match = self._calculate_skill_match(job, profile)
        experience_match = self._calculate_experience_match(job, profile)
        location_match = self._calculate_location_match(job, profile)
        salary_match = self._calculate_salary_match(job, profile)
        work_mode_match = self._calculate_work_mode_match(job, profile)
        
        # Weighted scoring
        match_score = int(
            skill_match * 0.35 +
            experience_match * 0.20 +
            location_match * 0.20 +
            work_mode_match * 0.15 +
            salary_match * 0.10
        )
        
        match_score = min(99, max(0, match_score))
        
        match_reason = self._generate_match_reasons(job, profile, {
            'skill_match': skill_match,
            'experience_match': experience_match,
            'location_match': location_match,
            'work_mode_match': work_mode_match,
        })
        
        matching_skills, missing_skills = self._analyze_skills(job, profile)
        
        return RankedJob(
            **job.dict(),
            match_score=match_score,
            match_reason=match_reason,
            missing_skills=missing_skills,
            matching_skills=matching_skills,
            skill_match=skill_match,
            experience_match=experience_match,
            location_match=location_match,
            salary_match=salary_match,
            work_mode_match=work_mode_match
        )
    
    def _calculate_skill_match(self, job: Job, profile: CandidateProfile) -> float:
        """Calculate skill match percentage"""
        if not job.skills:
            return 50.0
        
        profile_skills = [s.lower() for s in profile.skills]
        job_skills = [s.lower() for s in job.skills]
        
        matching = sum(1 for js in job_skills if any(ps in js or js in ps for ps in profile_skills))
        
        if not job_skills:
            return 50.0
        
        return min(100, (matching / len(job_skills)) * 100)
    
    def _calculate_experience_match(self, job: Job, profile: CandidateProfile) -> float:
        """Calculate experience level match"""
        title = job.title.lower()
        level = profile.experience_level.lower()
        
        is_senior = bool(re.search(r'senior|lead|principal|staff', title))
        is_mid = bool(re.search(r'mid|intermediate', title)) or (not is_senior and not re.search(r'junior|entry', title))
        is_junior = bool(re.search(r'junior|entry|associate', title))
        
        if 'senior' in level and is_senior:
            return 100
        if 'mid' in level and is_mid:
            return 100
        if ('junior' in level or 'entry' in level):
            if is_junior:
                return 100
            if is_mid:
                return 70
        
        return 70
    
    def _calculate_location_match(self, job: Job, profile: CandidateProfile) -> float:
        """Calculate location match"""
        job_location = job.location.lower()
        
        if 'remote' in job_location and profile.work_mode == 'remote':
            return 100
        
        if not profile.preferred_locations:
            return 100 if 'remote' in job_location else 50
        
        for loc in profile.preferred_locations:
            loc_lower = loc.lower()
            if loc_lower in job_location or job_location in loc_lower:
                return 100
            if loc_lower == 'remote' and 'remote' in job_location:
                return 100
        
        return 70 if 'remote' in job_location else 30
    
    def _calculate_salary_match(self, job: Job, profile: CandidateProfile) -> float:
        """Calculate salary match"""
        if not profile.salary_expectation or not job.salary:
            return 70
        
        salary = self._extract_salary_number(job.salary)
        if not salary:
            return 70
        
        expectation = profile.salary_expectation
        
        if expectation * 0.9 <= salary <= expectation * 1.2:
            return 100
        if expectation * 0.8 <= salary <= expectation * 1.3:
            return 80
        if salary >= expectation * 0.7:
            return 60
        
        return 40
    
    def _calculate_work_mode_match(self, job: Job, profile: CandidateProfile) -> float:
        """Calculate work mode match"""
        job_mode = job.work_mode.lower()
        profile_mode = profile.work_mode.lower()
        
        if profile_mode == 'any':
            return 100
        if job_mode == profile_mode:
            return 100
        if profile_mode == 'remote' and job_mode == 'hybrid':
            return 60
        if profile_mode == 'hybrid' and job_mode == 'remote':
            return 80
        
        return 30
    
    def _analyze_skills(self, job: Job, profile: CandidateProfile) -> Tuple[List[str], List[str]]:
        """Analyze matching and missing skills"""
        profile_skills = [s.lower() for s in profile.skills]
        
        matching_skills = []
        missing_skills = []
        
        for skill in job.skills:
            skill_lower = skill.lower()
            is_match = any(ps in skill_lower or skill_lower in ps for ps in profile_skills)
            
            if is_match:
                matching_skills.append(skill)
            else:
                missing_skills.append(skill)
        
        return matching_skills[:8], missing_skills[:6]
    
    def _generate_match_reasons(self, job: Job, profile: CandidateProfile, scores: Dict) -> List[str]:
        """Generate match reasons"""
        reasons = []
        
        if scores['skill_match'] >= 70:
            reasons.append(f"Strong skill match for {profile.desired_job_title}")
        
        if scores['location_match'] >= 90:
            if 'remote' in job.location.lower():
                reasons.append("Remote work matches your preference")
            else:
                reasons.append("Location matches your preference")
        
        if scores['experience_match'] >= 80:
            reasons.append("Experience level aligns well")
        
        if scores['work_mode_match'] >= 90:
            reasons.append(f"{job.work_mode.capitalize()} work mode matches")
        
        if not reasons:
            reasons.append("Relevant to your profile")
        
        return reasons[:3]
    
    def _extract_salary_number(self, salary: str) -> Optional[int]:
        """Extract number from salary string"""
        numbers = re.findall(r'\d+[,\d]*', salary)
        if not numbers:
            return None
        
        nums = [int(n.replace(',', '')) for n in numbers]
        return max(nums)
