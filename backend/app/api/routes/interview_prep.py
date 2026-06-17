"""Interview Preparation — question generation, answer evaluation, voice sessions."""
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from groq import Groq
from app.config import settings

router = APIRouter()

# ─────────────────────────────────────────────────────────────────────────────
# Shared models
# ─────────────────────────────────────────────────────────────────────────────

class GenerateQuestionsRequest(BaseModel):
    job_title: str
    company: Optional[str] = ""
    skills: Optional[List[str]] = []
    experience_level: Optional[str] = "mid"
    category: Optional[str] = "mixed"


class Question(BaseModel):
    id: int
    question: str
    category: str
    difficulty: str
    hint: Optional[str] = None
    sample_answer: Optional[str] = None


class GenerateQuestionsResponse(BaseModel):
    questions: List[Question]
    total: int


class EvaluateAnswerRequest(BaseModel):
    question: str
    answer: str
    job_title: Optional[str] = ""
    category: Optional[str] = "technical"


class EvaluateAnswerResponse(BaseModel):
    model_config = {"protected_namespaces": ()}
    score: int
    feedback: str
    strengths: List[str]
    improvements: List[str]
    model_answer_hint: str


# ─────────────────────────────────────────────────────────────────────────────
# Voice session models
# ─────────────────────────────────────────────────────────────────────────────

class VoiceSessionRequest(BaseModel):
    job_title: str
    company: Optional[str] = ""
    skills: Optional[List[str]] = []
    experience_level: Optional[str] = "mid"
    resume_summary: Optional[str] = ""
    experience: Optional[List[dict]] = []
    category: Optional[str] = "mixed"
    num_questions: Optional[int] = 5


class VoiceQuestion(BaseModel):
    id: int
    question: str
    category: str
    difficulty: str
    spoken_intro: str


class VoiceSessionResponse(BaseModel):
    questions: List[VoiceQuestion]
    opening_message: str
    closing_message: str


class VoiceEvaluateRequest(BaseModel):
    job_title: str
    pairs: List[dict]


class VoiceSessionReport(BaseModel):
    overall_score: int
    overall_feedback: str
    question_results: List[dict]
    top_strengths: List[str]
    top_improvements: List[str]
    hire_likelihood: str


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def _groq() -> Groq:
    if not settings.GROQ_API_KEY:
        raise HTTPException(status_code=503, detail="GROQ_API_KEY not configured")
    return Groq(api_key=settings.GROQ_API_KEY)


def _chat(client: Groq, prompt: str, system: str, max_tokens: int = 2000) -> dict:
    try:
        resp = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": prompt},
            ],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"},
            temperature=0.5,
            max_tokens=max_tokens,
        )
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Groq API error: {str(e)}")
    try:
        return json.loads(resp.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse AI response: {e}")


_LEVEL = {
    "fresher": "entry-level candidate, no industry experience",
    "1-3": "junior developer, 1-3 years experience",
    "3-5": "mid-level developer, 3-5 years experience",
    "5-8": "senior developer, 5-8 years experience",
    "8+": "principal/staff engineer, 8+ years experience",
    "mid": "mid-level candidate, 2-4 years experience",
    "senior": "senior candidate, 5+ years experience",
}

_CAT = {
    "technical": "Focus on technical coding and technology-specific questions.",
    "behavioral": "Focus on STAR-method behavioral questions.",
    "system-design": "Focus on system design and architecture questions.",
    "mixed": "Mix: 40% technical, 40% behavioral, 20% situational.",
}


# ─────────────────────────────────────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/questions", response_model=GenerateQuestionsResponse)
async def generate_questions(body: GenerateQuestionsRequest):
    """Generate personalised interview questions."""
    client = _groq()
    skills_str = ", ".join(body.skills[:10]) if body.skills else "general software engineering"
    level = _LEVEL.get(body.experience_level or "mid", "mid-level candidate")
    cat = _CAT.get(body.category or "mixed", _CAT["mixed"])

    prompt = f"""Generate 8 interview questions.

Role: {body.job_title}
Company: {body.company or 'a tech company'}
Skills: {skills_str}
Level: {level}
Focus: {cat}

Return JSON:
{{
  "questions": [
    {{
      "id": 1,
      "question": "Question text",
      "category": "technical|behavioral|system-design",
      "difficulty": "Easy|Medium|Hard",
      "hint": "One-sentence hint",
      "sample_answer": "2-3 sentence outline of a strong answer"
    }}
  ]
}}

Rules: vary difficulty (2 Easy, 4 Medium, 2 Hard), make questions specific to the role and skills."""

    data = _chat(client, prompt, "You are an expert technical interviewer. Respond with valid JSON only.", 2000)
    questions = [Question(**q) for q in data.get("questions", [])]
    return GenerateQuestionsResponse(questions=questions, total=len(questions))


@router.post("/evaluate", response_model=EvaluateAnswerResponse)
async def evaluate_answer(body: EvaluateAnswerRequest):
    """Score and give feedback on a single answer."""
    if not body.answer.strip():
        raise HTTPException(status_code=400, detail="Answer cannot be empty")
    client = _groq()

    prompt = f"""Evaluate this interview answer.

Question: {body.question}
Category: {body.category}
Role: {body.job_title or 'software engineer'}
Answer: {body.answer[:2000]}

Return JSON:
{{
  "score": <0-100>,
  "feedback": "2-3 sentence feedback",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "model_answer_hint": "Key points a strong answer would include"
}}

Scoring: 90-100 exceptional, 70-89 good, 50-69 average, below 50 poor."""

    data = _chat(client, prompt, "You are an expert interviewer. Respond with valid JSON only.", 800)
    return EvaluateAnswerResponse(
        score=int(data.get("score", 50)),
        feedback=data.get("feedback", ""),
        strengths=data.get("strengths", []),
        improvements=data.get("improvements", []),
        model_answer_hint=data.get("model_answer_hint", ""),
    )


@router.post("/voice-session", response_model=VoiceSessionResponse)
async def create_voice_session(body: VoiceSessionRequest):
    """Generate a full voice interview session from the candidate's resume."""
    client = _groq()
    num_q = max(3, min(8, body.num_questions or 5))
    skills_str = ", ".join(body.skills[:12]) if body.skills else "software engineering"
    level = _LEVEL.get(body.experience_level or "mid", "mid-level candidate")
    cat = _CAT.get(body.category or "mixed", _CAT["mixed"])

    exp_lines = "\n".join(
        f"- {e.get('title', '')} at {e.get('company', '')} ({e.get('duration', '')})"
        for e in (body.experience or [])[:4]
    ) or "Not provided"

    prompt = f"""You are a senior interviewer at {body.company or 'a top tech company'} running a spoken voice interview.

Candidate profile:
- Role: {body.job_title}
- Skills: {skills_str}
- Level: {level}
- Summary: {body.resume_summary or 'Not provided'}
- Experience:
{exp_lines}

Interview style: conversational and natural (will be read aloud by TTS).
Focus: {cat}
Generate exactly {num_q} questions.

Return JSON:
{{
  "opening_message": "Warm 2-sentence spoken greeting mentioning the role. Sound human and encouraging.",
  "closing_message": "Brief 1-2 sentence outro. Thank the candidate and mention next steps.",
  "questions": [
    {{
      "id": 1,
      "question": "Full question — natural spoken language, no markdown",
      "category": "technical|behavioral|system-design",
      "difficulty": "Easy|Medium|Hard",
      "spoken_intro": "Short 1-sentence transition before the question e.g. 'Great, next question.'"
    }}
  ]
}}

Make questions specific to the candidate's skills and background. Vary difficulty."""

    data = _chat(client, prompt, "You are a senior technical interviewer. Respond with valid JSON only.", 2500)
    questions = [VoiceQuestion(**q) for q in data.get("questions", [])]
    return VoiceSessionResponse(
        questions=questions,
        opening_message=data.get("opening_message",
            f"Welcome! Let's begin your interview for the {body.job_title} role. I'll ask you {num_q} questions. Take your time."),
        closing_message=data.get("closing_message",
            "Thank you for your time today. We'll review your answers and be in touch soon. Best of luck!"),
    )


@router.post("/voice-session/report", response_model=VoiceSessionReport)
async def evaluate_voice_session(body: VoiceEvaluateRequest):
    """Evaluate all Q&A pairs from a completed voice session and return a full report."""
    if not body.pairs:
        raise HTTPException(status_code=400, detail="No Q&A pairs provided")
    client = _groq()

    pairs_text = "\n\n".join(
        f"Q{i+1} [{p.get('category', 'general')}]: {p.get('question', '')}\n"
        f"Answer: {p.get('answer', '(no answer)')[:800]}"
        for i, p in enumerate(body.pairs)
    )

    prompt = f"""Evaluate a completed voice interview for: {body.job_title}

Transcript:
{pairs_text}

Return JSON:
{{
  "overall_score": <0-100>,
  "overall_feedback": "3-4 sentence overall assessment",
  "hire_likelihood": "Strong Yes|Yes|Maybe|No",
  "top_strengths": ["strength 1", "strength 2", "strength 3"],
  "top_improvements": ["area 1", "area 2"],
  "question_results": [
    {{
      "id": <1-based question number>,
      "score": <0-100>,
      "feedback": "1-2 sentence specific feedback",
      "key_missing": "Most important missing element, or empty string if strong"
    }}
  ]
}}

hire_likelihood: Strong Yes >= 85, Yes >= 70, Maybe >= 50, No < 50."""

    data = _chat(client, prompt, "You are a senior technical interviewer. Respond with valid JSON only.", 1500)
    return VoiceSessionReport(
        overall_score=int(data.get("overall_score", 60)),
        overall_feedback=data.get("overall_feedback", ""),
        question_results=data.get("question_results", []),
        top_strengths=data.get("top_strengths", []),
        top_improvements=data.get("top_improvements", []),
        hire_likelihood=data.get("hire_likelihood", "Maybe"),
    )
