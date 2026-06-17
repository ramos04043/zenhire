"""Internshala scraper — uses httpx (no header-size limit like aiohttp)."""
import re
import httpx
from typing import List, Optional
from ..types import CandidateProfile, Job
from ..normalizer import JobNormalizer

_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-IN,en;q=0.9",
    "Referer": "https://internshala.com/",
}


class InternshalaProvider:
    """Scrapes Internshala internships and fresher jobs."""

    BASE = "https://internshala.com"
    name = "Internshala"

    def __init__(self):
        self.normalizer = JobNormalizer()

    async def search_jobs(self, profile: CandidateProfile) -> List[Job]:
        keyword = self._keyword(profile)
        jobs: List[Job] = []

        urls = [
            f"{self.BASE}/internships/keywords-{keyword}",
            f"{self.BASE}/jobs/keywords-{keyword}",
        ]

        # httpx async client — no header-size limit problem
        async with httpx.AsyncClient(headers=_HEADERS, timeout=20,
                                     follow_redirects=True) as client:
            for url in urls:
                try:
                    r = await client.get(url)
                    if r.status_code == 200:
                        jobs.extend(self._parse(r.text, url))
                    else:
                        print(f"[Internshala] HTTP {r.status_code}: {url}")
                except Exception as e:
                    print(f"[Internshala] Error {url}: {e}")

        # deduplicate
        seen: set = set()
        unique: List[Job] = []
        for j in jobs:
            k = f"{j.title.lower()}|{j.company.lower()}"
            if k not in seen:
                seen.add(k)
                unique.append(j)

        print(f"[Internshala] {len(unique)} listings for '{keyword}'")
        return unique[:40]

    # ── parsing ──────────────────────────────────────────────────────────────

    def _parse(self, html: str, url: str) -> List[Job]:
        is_internship = "/internships/" in url
        jobs: List[Job] = []

        # Each listing is inside <div class="individual_internship ...">
        # We capture everything up to the closing triple-div pattern
        for card in re.findall(
            r'<div[^>]+class="[^"]*individual_internship[^"]*"[^>]*>(.*?)'
            r'</div>\s*</div>\s*</div>',
            html, re.DOTALL
        ):
            try:
                job = self._card(card, is_internship)
                if job:
                    jobs.append(job)
            except Exception:
                continue
        return jobs

    def _card(self, card: str, is_internship: bool) -> Optional[Job]:
        # Title
        title = (
            self._re(r'class="[^"]*job-internship-name[^"]*"[^>]*>\s*<a[^>]*>(.*?)</a>', card)
            or self._re(r'<a[^>]+class="[^"]*view_detail_button[^"]*"[^>]*>(.*?)</a>', card)
        )
        if not title:
            return None

        company = (
            self._re(r'<h4[^>]*class="[^"]*company-name[^"]*"[^>]*>(.*?)</h4>', card)
            or self._re(r'<p[^>]*class="[^"]*company-name[^"]*"[^>]*>(.*?)</p>', card)
            or "Company"
        )

        loc_raw = (
            self._re(r'id="location_names[^"]*"[^>]*>(.*?)</span>', card)
            or self._re(r'class="[^"]*location_link[^"]*"[^>]*>(.*?)</a>', card)
        )
        location = self._clean(loc_raw) if loc_raw else "India"

        stipend_raw = self._re(r'class="[^"]*stipend[^"]*"[^>]*>(.*?)</span>', card)
        salary = self._clean(stipend_raw) if stipend_raw else None

        duration_raw = self._re(r'class="[^"]*internship-duration[^"]*"[^>]*>(.*?)</span>', card)

        href = self._re(r'href="(/(?:internship|job)/detail/[^"]+)"', card)
        apply_url = f"{self.BASE}{href}" if href else self.BASE

        is_remote = bool(re.search(r"work from home|remote|wfh", card, re.IGNORECASE))

        skills_raw = re.findall(r'class="[^"]*round_tabs[^"]*"[^>]*>(.*?)</span>', card, re.DOTALL)
        skills = [self._clean(s) for s in skills_raw if self._clean(s)]

        desc_parts = []
        if is_internship:
            desc_parts.append("Internship")
        if duration_raw:
            desc_parts.append(f"Duration: {self._clean(duration_raw)}")
        if salary:
            desc_parts.append(f"Stipend: {salary}")
        desc_parts.append(f"Location: {location}")

        slug = re.sub(r"[^a-z0-9\-]", "", (href or f"{title}-{company}").lower().replace("/", "-"))

        return self.normalizer.normalize({
            "id": slug[:80],
            "title": self._clean(title),
            "company": self._clean(company),
            "location": location,
            "salary": salary,
            "employment_type": "internship" if is_internship else "full-time",
            "work_mode": "remote" if is_remote else "onsite",
            "description": " | ".join(desc_parts),
            "skills": skills[:10],
            "apply_url": apply_url,
        }, self.name)

    # ── helpers ───────────────────────────────────────────────────────────────

    def _keyword(self, profile: CandidateProfile) -> str:
        t = re.sub(r"[^a-z0-9\s]", "", profile.desired_job_title.strip().lower())
        return re.sub(r"\s+", "-", t.strip()) or "software-developer"

    def _re(self, pattern: str, text: str) -> Optional[str]:
        m = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
        return m.group(1).strip() if m else None

    def _clean(self, text: str) -> str:
        t = re.sub(r"<[^>]+>", "", text)
        t = t.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
        t = re.sub(r"&#\d+;", "", t)
        return re.sub(r"\s+", " ", t).strip()
