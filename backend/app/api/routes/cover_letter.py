"""Cover Letter Generation route — powered by Groq AI."""
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from groq import Groq
from app.config import settings

router = APIRouter()


class CoverLetterRequest(BaseModel):
    # Job details
    company: str
    position: str
    job_description: Optional[str] = ""
    # Candidate info (populated from resume analyzer)
    candidate_name: Optional[str] = ""
    candidate_skills: Optional[List[str]] = []
    resume_summary: Optional[str] = ""
    experience: Optional[List[dict]] = []
    tone: Optional[str] = "professional"   # professional | enthusiastic | concise


class CoverLetterResponse(BaseModel):
    cover_letter: str
    subject_line: str
    word_count: int


@router.post("/generate", response_model=CoverLetterResponse)
async def generate_cover_letter(body: CoverLetterRequest):
    """
    Generate a personalised cover letter using Groq AI.
    Uses candidate's resume data so the letter reflects their actual background.
    """
    if not settings.GROQ_API_KEY:
        raise HTTPException(status_code=503, detail="GROQ_API_KEY not configured")

    # Build experience bullet string
    exp_lines = ""
    if body.experience:
        exp_lines = "\n".join(
            f"- {e.get('title', '')} at {e.get('company', '')} ({e.get('duration', '')})"
            for e in body.experience[:4]
        )

    skills_str = ", ".join(body.candidate_skills[:15]) if body.candidate_skills else "not specified"

    tone_instruction = {
        "professional": "Write in a polished, formal professional tone.",
        "enthusiastic": "Write in an enthusiastic, energetic tone that shows genuine excitement.",
        "concise": "Write concisely — aim for 3 short paragraphs, no fluff.",
    }.get(body.tone or "professional", "Write in a polished, formal professional tone.")

    prompt = f"""You are an expert cover letter writer. Generate a compelling, personalised cover letter.

TARGET JOB:
Company: {body.company}
Position: {body.position}
Job Description: {(body.job_description or '')[:1500]}

CANDIDATE BACKGROUND:
Name: {body.candidate_name or 'the candidate'}
Summary: {body.resume_summary or 'Not provided'}
Skills: {skills_str}
Experience:
{exp_lines or 'Not provided'}

TONE: {tone_instruction}

RULES:
- Do NOT invent achievements or companies not mentioned above
- Address the letter to "Dear Hiring Manager" if no specific name is known
- Start with a strong opening hook — not "I am writing to apply"
- Reference 2-3 specific skills/experiences from the candidate's background
- End with a clear call to action
- Keep it to 3-4 paragraphs (~250-350 words)

Respond with valid JSON only:
{{
  "subject_line": "Application for {body.position} — [candidate name]",
  "cover_letter": "Full cover letter text with proper line breaks (use \\n for paragraphs)"
}}"""

    client = Groq(api_key=settings.GROQ_API_KEY)
    try:
        resp = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are an expert cover letter writer. Always respond with valid JSON."},
                {"role": "user", "content": prompt},
            ],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"},
            temperature=0.5,
            max_tokens=1200,
        )
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Groq API error: {str(e)}")

    try:
        result = json.loads(resp.choices[0].message.content)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to parse AI response")

    letter = result.get("cover_letter", "")
    return CoverLetterResponse(
        cover_letter=letter,
        subject_line=result.get("subject_line", f"Application for {body.position}"),
        word_count=len(letter.split()),
    )
