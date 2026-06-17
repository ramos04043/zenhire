import io
import json
import random
from typing import Any, Dict, List

import PyPDF2
from groq import Groq

from app.config import settings

class ResumeService:
    @staticmethod
    def extract_text_from_pdf(file_content: bytes) -> str:
        """Extract text from a PDF file content"""
        try:
            pdf_file = io.BytesIO(file_content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text
        except Exception as e:
            print(f"Error extracting text from PDF: {e}")
            return ""

    @staticmethod
    def extract_text_from_docx(file_content: bytes) -> str:
        """Extract text from a DOCX file content"""
        try:
            from docx import Document
            docx_file = io.BytesIO(file_content)
            doc = Document(docx_file)
            text = "\n".join([para.text for para in doc.paragraphs])
            return text
        except Exception as e:
            print(f"Error extracting text from DOCX: {e}")
            return ""

    @staticmethod
    def extract_text(file_content: bytes, filename: str) -> str:
        """Extract text from a supported resume file."""
        if filename.lower().endswith(".pdf"):
            return ResumeService.extract_text_from_pdf(file_content)
        if filename.lower().endswith(".docx"):
            return ResumeService.extract_text_from_docx(file_content)

        try:
            return file_content.decode("utf-8")
        except Exception:
            return ""

    @staticmethod
    def parse_resume(file_content: bytes, filename: str) -> Dict[str, Any]:
        """Extract structured data from a resume file."""
        print(f"[parse_resume] Starting parsing for {filename}")
        resume_text = ResumeService.extract_text(file_content, filename)
        print(f"[parse_resume] Extracted {len(resume_text)} characters of text")
        
        if not resume_text.strip():
            print("[parse_resume] No text extracted, using mock data")
            return ResumeService._get_mock_data()

        if not settings.GROQ_API_KEY:
            print("GROQ_API_KEY not found, falling back to mock parsed data")
            mock = ResumeService._get_mock_data()
            mock["summary"] = f"Mock summary generated for {filename}."
            return mock

        print("[parse_resume] Calling Groq API...")
        client = Groq(api_key=settings.GROQ_API_KEY, timeout=30.0)
        prompt = f"""
        You are an expert resume parser. Analyze the following resume text and return ONLY valid JSON.

        Resume text:
        {resume_text[:5000]}

        Required JSON shape:
        {{
            "name": "Full Name",
            "email": "Email Address",
            "phone": "Phone Number",
            "summary": "2-3 sentence professional summary",
            "skills": ["Skill 1", "Skill 2"],
            "experience": [
                {{
                    "title": "Job Title",
                    "company": "Company Name",
                    "duration": "Start - End Date",
                    "description": "Responsibility or achievement summary"
                }}
            ],
            "education": [
                {{
                    "degree": "Degree Name",
                    "institution": "Institution Name",
                    "year": "Graduation Year"
                }}
            ],
            "certifications": ["Certification 1"]
        }}
        """

        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that parses resumes into JSON. Always respond with valid JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model="llama-3.1-8b-instant",
                response_format={"type": "json_object"},
                timeout=30.0,
            )
            print("[parse_resume] Groq API call successful")
            return json.loads(chat_completion.choices[0].message.content)
        except Exception as e:
            print(f"[parse_resume] Error parsing resume with Groq: {e}")
            mock = ResumeService._get_mock_data()
            mock["summary"] = f"Mock summary generated for {filename}."
            return mock

    @staticmethod
    def calculate_ats(parsed_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate ATS analysis without any ZendBX dependency."""
        print("[calculate_ats] Starting ATS calculation")
        skills = ResumeService.extract_skills(parsed_data)
        experience = ResumeService.extract_experience(parsed_data)
        education = ResumeService.extract_education(parsed_data)

        if settings.GROQ_API_KEY:
            try:
                print("[calculate_ats] Calling Groq API for ATS analysis...")
                client = Groq(api_key=settings.GROQ_API_KEY, timeout=30.0)
                prompt = f"""
                As an ATS evaluator, analyze this resume data and return ONLY valid JSON.

                Resume data:
                {json.dumps(parsed_data)}

                Required JSON shape:
                {{
                    "score": 0,
                    "strengths": ["Strength 1"],
                    "weaknesses": ["Weakness 1"],
                    "recommendations": ["Recommendation 1"],
                    "keyword_analysis": {{
                        "matching_skills": ["Skill 1"],
                        "missing_skills": ["Skill 2"],
                        "match_percentage": 0
                    }}
                }}
                """
                chat_completion = client.chat.completions.create(
                    messages=[
                        {
                            "role": "system",
                            "content": "You are an ATS evaluator. Always respond with valid JSON."
                        },
                        {
                            "role": "user",
                            "content": prompt,
                        }
                    ],
                    model="llama-3.1-8b-instant",
                    response_format={"type": "json_object"},
                    timeout=30.0,
                )
                print("[calculate_ats] Groq API call successful")
                return json.loads(chat_completion.choices[0].message.content)
            except Exception as e:
                print(f"[calculate_ats] Error generating ATS analysis with Groq: {e}")

        print("[calculate_ats] Using fallback scoring")
        score = min(96, 58 + len(skills) * 5 + min(len(experience), 4) * 6 + min(len(education), 2) * 4 + random.randint(0, 6))
        return {
            "score": score,
            "strengths": ["Clear structure", "Relevant skills included", "Experience is easy to scan"],
            "weaknesses": ["Needs more quantified achievements"],
            "recommendations": ResumeService.generate_suggestions(parsed_data),
            "keyword_analysis": {
                "matching_skills": skills[:4],
                "missing_skills": ["Leadership", "Stakeholder Management"] if len(skills) < 6 else [],
                "match_percentage": score,
            },
        }

    @staticmethod
    def extract_skills(parsed_data: Dict[str, Any]) -> List[str]:
        skills = parsed_data.get("skills", [])
        if not isinstance(skills, list):
            return []
        return [skill for skill in skills if isinstance(skill, str) and skill.strip()]

    @staticmethod
    def extract_education(parsed_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        education = parsed_data.get("education", [])
        return education if isinstance(education, list) else []

    @staticmethod
    def extract_experience(parsed_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        experience = parsed_data.get("experience", [])
        return experience if isinstance(experience, list) else []

    @staticmethod
    def generate_suggestions(parsed_data: Dict[str, Any]) -> List[str]:
        suggestions: List[str] = []
        if len(ResumeService.extract_skills(parsed_data)) < 5:
            suggestions.append("Add more role-specific keywords to improve ATS matching.")
        if len(ResumeService.extract_experience(parsed_data)) == 0:
            suggestions.append("Add measurable impact statements to the experience section.")
        if len(ResumeService.extract_education(parsed_data)) == 0:
            suggestions.append("Include education details to improve resume completeness.")
        if not parsed_data.get("summary"):
            suggestions.append("Add a concise professional summary tailored to your target role.")
        return suggestions or ["Quantify achievements with numbers to strengthen your resume."]

    @staticmethod
    def match_jobs(parsed_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        skills = ResumeService.extract_skills(parsed_data)
        companies = ["ZenTech", "Northstar Labs", "PixelWorks"]
        matches: List[Dict[str, Any]] = []
        for index, skill in enumerate(skills[:3]):
            matches.append({
                "title": f"{skill} Specialist",
                "company": companies[index],
                "match_score": 82 - index * 4,
            })
        return matches

    @staticmethod
    def analyze_resume(file_content: bytes, filename: str) -> Dict[str, Any]:
        parsed_data = ResumeService.parse_resume(file_content, filename)
        ats_analysis = ResumeService.calculate_ats(parsed_data)
        return {
            "filename": filename,
            "parsed_data": parsed_data,
            "ats_analysis": ats_analysis,
            "skills": ResumeService.extract_skills(parsed_data),
            "experience": ResumeService.extract_experience(parsed_data),
            "education": ResumeService.extract_education(parsed_data),
            "summary": parsed_data.get("summary", ""),
            "suggestions": ResumeService.generate_suggestions(parsed_data),
            "job_matches": ResumeService.match_jobs(parsed_data),
            "message": "Resume analyzed successfully",
        }
        
    @staticmethod
    def analyze_resume_for_api(file_content: bytes, filename: str) -> Dict[str, Any]:
        """
        Returns resume analysis in the exact JSON structure requested for the API:
        {
          "atsScore": 92,
          "summary": "...",
          "skills": [],
          "experience": [],
          "education": [],
          "missingKeywords": [],
          "strengths": [],
          "weaknesses": [],
          "recommendations": [],
          "jobMatchScore": 95
        }
        """
        parsed_data = ResumeService.parse_resume(file_content, filename)
        ats_analysis = ResumeService.calculate_ats(parsed_data)
        
        skills = ResumeService.extract_skills(parsed_data)
        experience = ResumeService.extract_experience(parsed_data)
        education = ResumeService.extract_education(parsed_data)
        
        return {
            "atsScore": ats_analysis.get("score", 75),
            "summary": parsed_data.get("summary", ""),
            "skills": skills,
            "experience": experience,
            "education": education,
            "missingKeywords": ats_analysis.get("keyword_analysis", {}).get("missing_skills", []),
            "strengths": ats_analysis.get("strengths", []),
            "weaknesses": ats_analysis.get("weaknesses", []),
            "recommendations": ats_analysis.get("recommendations", []),
            "jobMatchScore": ats_analysis.get("keyword_analysis", {}).get("match_percentage", 75)
        }

    @staticmethod
    def _get_mock_data() -> Dict[str, Any]:
        """Fallback mock data"""
        return {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "phone": "+1-555-0100",
            "summary": "Product-focused candidate with experience delivering user-centered features.",
            "skills": ["Python", "JavaScript", "React", "FastAPI"],
            "experience": [
                {
                    "title": "Software Engineer",
                    "company": "ZenHire Demo",
                    "duration": "2022 - Present",
                    "description": "Built product features and internal tooling for recruiting workflows."
                }
            ],
            "education": [
                {
                    "degree": "BSc Computer Science",
                    "institution": "Demo University",
                    "year": "2021"
                }
            ],
            "certifications": []
        }
