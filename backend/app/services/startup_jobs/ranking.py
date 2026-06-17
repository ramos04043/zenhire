from typing import List
from .types import StartupJob, RankedStartupJob, StartupCandidateProfile, StartupStage


class StartupJobRanker:
    """Ranks startup jobs based on candidate profile"""
    
    def rank_jobs(
        self, 
        jobs: List[StartupJob], 
        profile: StartupCandidateProfile
    ) -> List[RankedStartupJob]:
        """Rank jobs by match score"""
        
        ranked_jobs = []
        
        for job in jobs:
            ranked_job = self._rank_single_job(job, profile)
            ranked_jobs.append(ranked_job)
        
        # Sort by match score (descending)
        ranked_jobs.sort(key=lambda x: x.match_score, reverse=True)
        
        return ranked_jobs
    
    def _rank_single_job(
        self, 
        job: StartupJob, 
        profile: StartupCandidateProfile
    ) -> RankedStartupJob:
        """Rank a single job"""
        
        # Calculate individual match scores
        skill_match = self._calculate_skill_match(job, profile)
        experience_match = self._calculate_experience_match(job, profile)
        location_match = self._calculate_location_match(job, profile)
        salary_match = self._calculate_salary_match(job, profile)
        work_mode_match = self._calculate_work_mode_match(job, profile)
        startup_stage_match = self._calculate_startup_stage_match(job, profile)
        industry_match = self._calculate_industry_match(job, profile)
        tech_stack_match = self._calculate_tech_stack_match(job, profile)
        company_culture_match = self._calculate_company_culture_match(job, profile)
        
        # Weighted average
        weights = {
            "skill": 0.25,
            "experience": 0.15,
            "location": 0.10,
            "salary": 0.10,
            "work_mode": 0.10,
            "startup_stage": 0.10,
            "industry": 0.10,
            "tech_stack": 0.05,
            "company_culture": 0.05
        }
        
        total_score = (
            skill_match * weights["skill"] +
            experience_match * weights["experience"] +
            location_match * weights["location"] +
            salary_match * weights["salary"] +
            work_mode_match * weights["work_mode"] +
            startup_stage_match * weights["startup_stage"] +
            industry_match * weights["industry"] +
            tech_stack_match * weights["tech_stack"] +
            company_culture_match * weights["company_culture"]
        )
        
        match_score = int(total_score * 100)
        
        # Generate match reasons
        match_reasons = self._generate_match_reasons(
            job, profile, skill_match, startup_stage_match, industry_match
        )
        
        # Find matching and missing skills
        matching_skills = [
            skill for skill in job.skills
            if skill.lower() in [s.lower() for s in profile.skills]
        ]
        missing_skills = [
            skill for skill in job.skills
            if skill.lower() not in [s.lower() for s in profile.skills]
        ]
        
        return RankedStartupJob(
            **job.dict(),
            match_score=match_score,
            match_reason=match_reasons,
            matching_skills=matching_skills,
            missing_skills=missing_skills,
            skill_match=skill_match,
            experience_match=experience_match,
            location_match=location_match,
            salary_match=salary_match,
            work_mode_match=work_mode_match,
            startup_stage_match=startup_stage_match,
            industry_match=industry_match,
            tech_stack_match=tech_stack_match,
            company_culture_match=company_culture_match
        )
    
    def _calculate_skill_match(self, job: StartupJob, profile: StartupCandidateProfile) -> float:
        """Calculate skill match score"""
        if not job.skills or not profile.skills:
            return 0.5
        
        job_skills_lower = [s.lower() for s in job.skills]
        profile_skills_lower = [s.lower() for s in profile.skills]
        
        matching = sum(1 for skill in profile_skills_lower if skill in job_skills_lower)
        
        return min(matching / len(profile_skills_lower), 1.0) if profile_skills_lower else 0.5
    
    def _calculate_experience_match(self, job: StartupJob, profile: StartupCandidateProfile) -> float:
        """Calculate experience level match"""
        if not job.experience_level:
            return 0.7
        
        level_hierarchy = ["junior", "mid", "senior", "staff", "principal"]
        
        try:
            job_level = level_hierarchy.index(job.experience_level.lower())
            profile_level = level_hierarchy.index(profile.experience_level.lower())
            
            diff = abs(job_level - profile_level)
            
            if diff == 0:
                return 1.0
            elif diff == 1:
                return 0.8
            elif diff == 2:
                return 0.5
            else:
                return 0.3
        except ValueError:
            return 0.7
    
    def _calculate_location_match(self, job: StartupJob, profile: StartupCandidateProfile) -> float:
        """Calculate location match"""
        if job.work_mode.lower() == "remote":
            return 1.0
        
        if not profile.preferred_locations:
            return 0.7
        
        job_location_lower = job.location.lower()
        
        for preferred in profile.preferred_locations:
            if preferred.lower() in job_location_lower:
                return 1.0
        
        return 0.3
    
    def _calculate_salary_match(self, job: StartupJob, profile: StartupCandidateProfile) -> float:
        """Calculate salary match"""
        if not profile.salary_expectation or not job.salary_min:
            return 0.7
        
        if job.salary_max and profile.salary_expectation <= job.salary_max:
            return 1.0
        elif profile.salary_expectation <= job.salary_min:
            return 1.0
        elif profile.salary_expectation > job.salary_min:
            ratio = job.salary_min / profile.salary_expectation
            return max(ratio, 0.3)
        
        return 0.5
    
    def _calculate_work_mode_match(self, job: StartupJob, profile: StartupCandidateProfile) -> float:
        """Calculate work mode match"""
        if profile.work_mode == "any":
            return 1.0
        
        job_mode = job.work_mode.lower()
        profile_mode = profile.work_mode.lower()
        
        if job_mode == profile_mode:
            return 1.0
        elif job_mode == "remote" or profile_mode == "remote":
            return 0.8
        elif job_mode == "hybrid" or profile_mode == "hybrid":
            return 0.6
        
        return 0.4
    
    def _calculate_startup_stage_match(self, job: StartupJob, profile: StartupCandidateProfile) -> float:
        """Calculate startup stage match"""
        if not profile.preferred_startup_stages or not job.startup_stage:
            return 0.7
        
        if job.startup_stage in profile.preferred_startup_stages:
            return 1.0
        
        # Adjacent stages get partial credit
        stage_order = [
            StartupStage.PRE_SEED,
            StartupStage.SEED,
            StartupStage.SERIES_A,
            StartupStage.SERIES_B,
            StartupStage.SERIES_C,
            StartupStage.SERIES_D_PLUS,
            StartupStage.PUBLIC
        ]
        
        try:
            job_idx = stage_order.index(job.startup_stage)
            preferred_indices = [stage_order.index(s) for s in profile.preferred_startup_stages]
            
            min_distance = min(abs(job_idx - idx) for idx in preferred_indices)
            
            if min_distance == 0:
                return 1.0
            elif min_distance == 1:
                return 0.7
            elif min_distance == 2:
                return 0.4
            else:
                return 0.2
        except ValueError:
            return 0.7
    
    def _calculate_industry_match(self, job: StartupJob, profile: StartupCandidateProfile) -> float:
        """Calculate industry match"""
        if not profile.preferred_industries or not job.industries:
            return 0.7
        
        matching_industries = set(job.industries) & set(profile.preferred_industries)
        
        if matching_industries:
            return 1.0
        
        return 0.3
    
    def _calculate_tech_stack_match(self, job: StartupJob, profile: StartupCandidateProfile) -> float:
        """Calculate tech stack match"""
        if not profile.preferred_tech_stack or not job.tech_stack:
            return 0.7
        
        job_tech_lower = [t.lower() for t in job.tech_stack]
        profile_tech_lower = [t.lower() for t in profile.preferred_tech_stack]
        
        matching = sum(1 for tech in profile_tech_lower if tech in job_tech_lower)
        
        if matching > 0:
            return min(matching / len(profile_tech_lower), 1.0)
        
        return 0.5
    
    def _calculate_company_culture_match(self, job: StartupJob, profile: StartupCandidateProfile) -> float:
        """Calculate company culture match based on team size, equity, etc."""
        score = 0.5
        
        # Team size preference
        if profile.min_team_size and job.team_size:
            if job.team_size >= profile.min_team_size:
                score += 0.2
        
        if profile.max_team_size and job.team_size:
            if job.team_size <= profile.max_team_size:
                score += 0.2
        
        # Equity importance
        if profile.equity_important and job.equity_offered:
            score += 0.3
        
        # Visa sponsorship
        if profile.visa_sponsorship_required and job.visa_sponsorship:
            score += 0.3
        
        return min(score, 1.0)
    
    def _generate_match_reasons(
        self, 
        job: StartupJob, 
        profile: StartupCandidateProfile,
        skill_match: float,
        startup_stage_match: float,
        industry_match: float
    ) -> List[str]:
        """Generate human-readable match reasons"""
        reasons = []
        
        if skill_match >= 0.7:
            reasons.append(f"Strong skill match with {job.company}")
        
        if job.is_dream_company:
            reasons.append("This is one of your dream companies!")
        
        if job.is_yc_company:
            reasons.append("Y Combinator backed company")
        
        if startup_stage_match >= 0.8:
            reasons.append(f"Perfect stage match: {job.startup_stage.value if job.startup_stage else 'startup'}")
        
        if industry_match >= 0.8:
            reasons.append(f"Matches your industry preferences")
        
        if job.work_mode == "remote" and profile.work_mode == "remote":
            reasons.append("Fully remote position")
        
        if job.equity_offered and profile.equity_important:
            reasons.append("Equity offered")
        
        if job.visa_sponsorship and profile.visa_sponsorship_required:
            reasons.append("Visa sponsorship available")
        
        if not reasons:
            reasons.append(f"Opportunity at {job.company}")
        
        return reasons[:3]  # Top 3 reasons
