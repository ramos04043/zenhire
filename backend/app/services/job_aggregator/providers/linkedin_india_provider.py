"""LinkedIn India — public guest job search API (no login needed)."""
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
    "Accept": "text/html,application/xhtml+xml,*/*;q=0.9",
    "Accept-Language": "en-IN,en;q=0.9",
    "Referer": "https://www.linkedin.com/jobs/search/",
}

# LinkedIn's public (no-auth) job search endpoint
_GUEST_API = "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search"


class LinkedInIndiaProvider:
    """Scrapes LinkedIn public job listings for India."""

    name = "LinkedIn"

    def __init__(self):
        self.normalizer = JobNormalizer()

    async def search_jobs(self, profile: CandidateProfile) -> List[Job]:
        keyword = self._keyword(profile)
        location = self._location(profile)
        jobs: List[Job] = []

        # LinkedIn guest API returns ~10 jobs per page, paginate across 4 pages
        async with httpx.AsyncClient(headers=_HEADERS, timeout=20,
                                     follow_redirects=True) as client:
            for start in [0, 10, 20, 30]:
                try:
                    # Small delay between pages to avoid rate limiting
                    if start > 0:
                        import asyncio
                        await asyncio.sleep(0.5)
                    r = await client.get(_GUEST_API, params={
                        "keywords": keyword,
                        "location": location,
                        "f_TPR": "r2592000",   # last 30 days
                        "start": str(start),
                    })
                    if r.status_code != 200 or len(r.text) < 100:
                        print(f"[LinkedIn] HTTP {r.status_code} or empty response at start={start}, stopping")
                        break
                    batch = self._parse(r.text)
                    jobs.extend(batch)
                    print(f"[LinkedIn] page start={start}: {len(batch)} cards ({len(r.text)} bytes)")
                    if len(batch) < 2:   # no more results
                        break
                except Exception as e:
                    print(f"[LinkedIn] Error start={start}: {e}")
                    break

        # deduplicate
        seen: set = set()
        unique: List[Job] = []
        for j in jobs:
            k = f"{j.title.lower()}|{j.company.lower()}"
            if k not in seen:
                seen.add(k)
                unique.append(j)

        print(f"[LinkedIn] {len(unique)} listings for '{keyword}' in '{location}'")
        return unique[:40]

    # ── parsing ──────────────────────────────────────────────────────────────

    def _parse(self, html: str) -> List[Job]:
        jobs: List[Job] = []
        # Each job is a <li> containing a div with class "base-card"
        # Split on <li> boundaries
        for card in re.split(r'(?=<li[>\s])', html):
            if 'base-card' not in card and 'job-search-card' not in card:
                continue
            try:
                j = self._card(card)
                if j:
                    jobs.append(j)
            except Exception:
                continue
        return jobs

    def _card(self, card: str) -> Optional[Job]:
        # Title — inside h3 with class containing "base-search-card__title"
        title = self._re(
            r'class="[^"]*base-search-card__title[^"]*"[^>]*>\s*(.*?)\s*</h3>', card)
        if not title:
            # fallback: aria-label on the main link
            title = self._re(r'aria-label="([^"]+)"', card)
        if not title:
            return None

        # Company — h4 subtitle, strip nested tags
        company_raw = self._re(
            r'class="[^"]*base-search-card__subtitle[^"]*"[^>]*>(.*?)</h4>', card)
        company = self._clean(company_raw) if company_raw else "Company"

        # Location — span
        loc_raw = self._re(
            r'class="[^"]*job-search-card__location[^"]*"[^>]*>(.*?)</span>', card)
        if not loc_raw:
            loc_raw = self._re(r'class="[^"]*base-search-card__metadata[^"]*"[^>]*>(.*?)</span>', card)
        location = self._clean(loc_raw) if loc_raw else "India"

        # Date
        date_raw = self._re(r'<time[^>]*>(.*?)</time>', card)
        posted = self._clean(date_raw) if date_raw else None

        # Apply URL — href on main link or data-entity-urn based URL
        href = self._re(r'href="(https://[^"]*linkedin\.com/jobs/view/[^"?&]+)', card)
        if not href:
            href = self._re(r'href="(https://[^"]*linkedin\.com/jobs/[^"?&]+)"', card)
        apply_url = href or "https://www.linkedin.com/jobs/"

        # Job ID
        urn = self._re(r'data-entity-urn="urn:li:jobPosting:(\d+)"', card)
        job_id = urn or re.sub(r"\s+", "-", (title or "job").lower())[:60]

        is_remote = bool(re.search(r"remote|work from home|wfh", location, re.IGNORECASE))

        return self.normalizer.normalize({
            "id": f"li_{job_id}",
            "title": self._clean(title),
            "company": company,
            "location": location,
            "salary": None,
            "employment_type": "full-time",
            "work_mode": "remote" if is_remote else "onsite",
            "description": f"{self._clean(title)} at {company}. Location: {location}",
            "skills": [],
            "apply_url": apply_url,
            "posted_date": posted,
        }, self.name)

    # ── helpers ───────────────────────────────────────────────────────────────

    def _keyword(self, profile: CandidateProfile) -> str:
        title = profile.desired_job_title.strip() or "software developer"
        level = profile.experience_level or ""
        # Add fresher signal for entry-level
        if level in ("fresher", "1-3"):
            return f"{title} fresher"
        return title

    def _location(self, profile: CandidateProfile) -> str:
        locs = profile.preferred_locations
        if not locs:
            return "India"
        loc = locs[0].strip()
        # LinkedIn works best with city, Country format
        if "india" not in loc.lower() and "remote" not in loc.lower():
            return f"{loc}, India"
        return loc

    def _re(self, pattern: str, text: str) -> Optional[str]:
        m = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
        return m.group(1).strip() if m else None

    def _clean(self, text: str) -> str:
        t = re.sub(r"<[^>]+>", "", text)
        t = t.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
        t = re.sub(r"&#\d+;", "", t)
        return re.sub(r"\s+", " ", t).strip()
