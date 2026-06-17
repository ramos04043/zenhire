import json
from typing import Any, Dict, Optional
from groq import Groq
from app.config import settings


SYSTEM_PROMPT = """You are an expert ATS resume optimizer with deep knowledge of:
- ATS parsing and ranking algorithms
- Keyword optimization and skill matching
- Professional resume formatting
- Action verbs and achievement quantification
- Industry-specific language and terminology

STRICT RULES FOR SAFETY AND HONESTY:
❌ NEVER invent companies, projects, skills, education, certifications, or achievements
❌ NEVER add years of experience that are not in the original resume
❌ NEVER fabricate any information whatsoever
❌ NEVER claim experience the candidate doesn't have
❌ NEVER add degrees or certifications that don't exist

✅ YOU MAY:
✅ Rewrite sentences for clarity and impact
✅ Improve grammar and professional wording
✅ Enhance action verbs (Led → Architected, Managed → Orchestrated)
✅ Improve ATS formatting and keyword placement
✅ Reorganize sections for better readability
✅ Reorder skills to prioritize job relevance
✅ Quantify achievements ONLY if clearly supported by existing resume content
✅ Bridge gaps between candidate skills and job requirements using exact wording from their resume

QUALITY GUIDELINES:
- Every change must improve ATS compatibility without adding false information
- Focus on keyword alignment with job description
- Maintain professional tone throughout
- Use industry-standard terminology
- Ensure readability for both ATS and human recruiters
- Always respond with valid, properly formatted JSON"""


def optimize_resume(
    parsed_resume: Dict[str, Any],
    ats_analysis: Dict[str, Any],
    job_title: str,
    company_name: str,
    job_description: str,
) -> Dict[str, Any]:
    """
    Use Groq to optimize a resume for a specific job.
    Never fabricates — only improves wording, keywords, ATS formatting.
    Returns structured optimization result with detailed changes.
    """
    if not settings.GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY not configured")

    ats_before = ats_analysis.get("score", 70)
    skills = parsed_resume.get("skills", [])
    experience = parsed_resume.get("experience", [])
    education = parsed_resume.get("education", [])
    projects = parsed_resume.get("projects", [])
    summary = parsed_resume.get("summary", "")
    name = parsed_resume.get("name", "")
    email = parsed_resume.get("email", "")
    phone = parsed_resume.get("phone", "")

    prompt = f"""
OPTIMIZE THIS RESUME FOR A SPECIFIC JOB OPPORTUNITY

=== TARGET JOB ===
Company: {company_name}
Role: {job_title}
Job Description (first 2000 chars):
{job_description[:2000]}

=== CANDIDATE RESUME DATA ===
Name: {name}
Email: {email}
Phone: {phone}

Professional Summary:
{summary}

Skills ({len(skills)} total):
{json.dumps(skills)}

Experience ({len(experience)} roles):
{json.dumps(experience, indent=2)}

Education ({len(education)} entries):
{json.dumps(education, indent=2)}

Projects ({len(projects)} projects):
{json.dumps(projects, indent=2) if projects else "None provided"}

ATS Analysis:
- Current Score: {ats_before}
- Weaknesses: {json.dumps(ats_analysis.get('weaknesses', []))}
- Missing Keywords: {json.dumps(ats_analysis.get('keyword_analysis', {}).get('missing_skills', []))}

=== OPTIMIZATION TASKS ===
1. Analyze the job description for critical keywords and required skills
2. Compare with candidate's background — identify alignment opportunities
3. Rewrite professional summary to naturally incorporate key job requirements
4. Improve each experience entry with stronger action verbs and relevant keywords
5. Reorder skills to match job description priority
6. Identify keywords that candidate genuinely has but hasn't explicitly mentioned
7. Estimate realistic ATS score improvement

=== OUTPUT FORMAT (VALID JSON ONLY) ===
Return this exact JSON structure:
{{
  "optimizedSummary": "2-3 sentence professional summary incorporating job-relevant keywords from candidate's existing experience",
  "optimizedExperience": [
    {{
      "title": "Job Title (unchanged)",
      "company": "Company Name (unchanged)",
      "duration": "Duration (unchanged)",
      "description": "Improved description with stronger action verbs and 2-3 key skills/achievements from job description that candidate demonstrated"
    }}
  ],
  "optimizedProjects": [
    {{
      "title": "Project Title (unchanged)",
      "description": "Improved description emphasizing job-relevant technologies and outcomes"
    }}
  ],
  "optimizedSkills": ["Skill1", "Skill2", "Skill3"],
  "addedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword_not_in_resume", "skill_candidate_doesn_have"],
  "atsBefore": {ats_before},
  "atsAfter": {min(99, ats_before + 8)},
  "changes": [
    "Rewrote summary to emphasize X relevant to the role",
    "Enhanced Y experience with stronger action verbs and Z keywords",
    "Reordered skills to prioritize job-critical technologies"
  ],
  "strengths": ["existing_strength_1", "existing_strength_2"],
  "remainingWeaknesses": ["gap_that_cannot_be_filled"],
  "optimizedResumeMarkdown": "# {name}\\n\\n{email} | {phone}\\n\\n## Professional Summary\\n[summary]\\n\\n## Experience\\n[entries with improved descriptions]\\n\\n## Skills\\n[reordered skills]\\n\\n## Education\\n[education entries]"
}}

CRITICAL REMINDERS:
- Do NOT invent or add information not in the original resume
- Only reword, reorder, and emphasize existing qualifications
- Ensure JSON is valid and can be parsed
- Every "added keyword" must be demonstrable from resume content
- Be realistic with ATS score improvements (5-15 points typical)
"""

    client = Groq(api_key=settings.GROQ_API_KEY)
    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"},
            temperature=0.3,
            max_tokens=4000,
        )
    except Exception as e:
        raise ValueError(f"Groq API error: {str(e)}")

    try:
        result = json.loads(response.choices[0].message.content)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse AI response as JSON: {str(e)}")

    # Validate and normalize result
    result["atsBefore"] = ats_before
    result["optimizedExperience"] = result.get("optimizedExperience", [])
    result["optimizedProjects"] = result.get("optimizedProjects", [])
    result["optimizedSkills"] = result.get("optimizedSkills", skills)
    result["addedKeywords"] = result.get("addedKeywords", [])
    result["missingKeywords"] = result.get("missingKeywords", [])
    result["changes"] = result.get("changes", [])
    result["strengths"] = result.get("strengths", [])
    result["remainingWeaknesses"] = result.get("remainingWeaknesses", [])

    # Safety: atsAfter must be >= atsBefore and <= 99
    ats_after = result.get("atsAfter", ats_before)
    if not ats_after or ats_after <= ats_before:
        # Realistic improvement: 5-15 points depending on keywords added
        improvement = min(15, max(5, len(result.get("addedKeywords", [])) * 2))
        ats_after = min(99, ats_before + improvement)
    result["atsAfter"] = ats_after

    # Generate full markdown if not provided
    if not result.get("optimizedResumeMarkdown"):
        result["optimizedResumeMarkdown"] = generate_markdown_resume(
            name, email, phone, result["optimizedSummary"],
            result.get("optimizedExperience", []),
            result.get("optimizedProjects", []),
            result.get("optimizedSkills", []),
            education
        )

    return result


def generate_markdown_resume(
    name: str,
    email: str,
    phone: str,
    summary: str,
    experience: list,
    projects: list,
    skills: list,
    education: list,
) -> str:
    """Generate a clean markdown resume from structured data."""
    lines = [f"# {name}\n"]

    if email or phone:
        contact = []
        if email:
            contact.append(email)
        if phone:
            contact.append(phone)
        lines.append(f"{' | '.join(contact)}\n")

    if summary:
        lines.append("## Professional Summary\n")
        lines.append(f"{summary}\n")

    if experience:
        lines.append("## Experience\n")
        for exp in experience:
            lines.append(f"### {exp.get('title', 'Position')} @ {exp.get('company', 'Company')}")
            if exp.get("duration"):
                lines.append(f"*{exp['duration']}*\n")
            if exp.get("description"):
                lines.append(f"{exp['description']}\n")

    if projects:
        lines.append("## Projects\n")
        for proj in projects:
            lines.append(f"### {proj.get('title', 'Project')}\n")
            if proj.get("description"):
                lines.append(f"{proj['description']}\n")

    if skills:
        lines.append("## Skills\n")
        lines.append(", ".join(skills))
        lines.append("\n")

    if education:
        lines.append("## Education\n")
        for edu in education:
            lines.append(f"**{edu.get('degree', 'Degree')}** — {edu.get('institution', 'Institution')}")
            if edu.get("year"):
                lines.append(f" ({edu['year']})")
            lines.append("\n")

    return "\n".join(lines)
