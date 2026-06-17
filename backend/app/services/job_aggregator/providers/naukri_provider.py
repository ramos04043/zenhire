"""Naukri.com scraper — parses Next.js RSC payload and HTML cards."""
import re
import json
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
    "Referer": "https://www.naukri.com/",
}


class NaukriProvider:
    name = "Naukri"

    def __init__(self):
        self.normalizer = JobNormalizer()

    # ── public ────────────────────────────────────────────────────────────────

    async def search_jobs(self, profile: CandidateProfile) -> List[Job]:
        keyword = self._keyword(profile)
        location = self._location(profile)

        kslug = keyword.lower().replace(" ", "-")
        lslug = location.lower().replace(" ", "-") if location else ""
        url = (f"https://www.naukri.com/{kslug}-jobs-in-{lslug}"
               if lslug else f"https://www.naukri.com/{kslug}-jobs")

        html = ""
        async with httpx.AsyncClient(headers=_HEADERS, timeout=20,
                                     follow_redirects=True) as client:
            try:
                r = await client.get(url)
                print(f"[Naukri] {r.status_code} {url} ({len(r.text)} bytes)")
                if r.status_code == 200:
                    html = r.text
            except Exception as e:
                print(f"[Naukri] Error: {e}")

        jobs = self._parse(html)

        seen: set = set()
        unique: List[Job] = []
        for j in jobs:
            k = f"{j.title.lower()}|{j.company.lower()}"
            if k not in seen:
                seen.add(k)
                unique.append(j)

        print(f"[Naukri] {len(unique)} listings for '{keyword}'")
        return unique[:40]

    # ── parsing ──────────────────────────────────────────────────────────────

    def _parse(self, html: str) -> List[Job]:
        if not html:
            return []
        jobs = self._from_nextjs(html)
        if not jobs:
            jobs = self._from_cards(html)
        return jobs

    def _from_nextjs(self, html: str) -> List[Job]:
        """
        Naukri is a Next.js app. Job data lives inside:
          self.__next_f.push([1, "14:[[...big JSON string...]]"])
        The value is a JSON-encoded string so we find jobDetails arrays inside it.
        """
        jobs: List[Job] = []

        # Collect all __next_f push payloads
        for m in re.finditer(r'self\.__next_f\.push\(\[1\s*,\s*"(.*?)"\]\s*\)',
                             html, re.DOTALL):
            chunk = m.group(1)
            # Unescape: \" → "  \\ → \  \n → space
            try:
                chunk = chunk.encode().decode('unicode_escape')
            except Exception:
                chunk = chunk.replace('\\"', '"').replace('\\\\', '\\')

            # Find all "jobDetails":[...] arrays in this chunk
            for jd in re.finditer(r'"jobDetails"\s*:\s*(\[.*?\])', chunk, re.DOTALL):
                try:
                    items = json.loads(jd.group(1))
                    for item in items:
                        j = self._norm(item)
                        if j:
                            jobs.append(j)
                except Exception:
                    continue

        if jobs:
            print(f"[Naukri] Parsed {len(jobs)} jobs from Next.js payload")
        return jobs

    def _from_cards(self, html: str) -> List[Job]:
        """Fallback: regex over HTML card elements."""
        jobs: List[Job] = []
        # Try several Naukri card class names across versions
        for pat in [
            r'<article[^>]+class="[^"]*jobTuple[^"]*"[^>]*>(.*?)</article>',
            r'<div[^>]+class="[^"]*srp-jobtuple[^"]*"[^>]*>(.*?)</div>\s*</div>',
            r'<div[^>]+class="[^"]*job-tuple[^"]*"[^>]*>(.*?)</div>\s*</div>',
        ]:
            matches = re.findall(pat, html, re.DOTALL)
            for card in matches:
                try:
                    j = self._card(card)
                    if j:
                        jobs.append(j)
                except Exception:
                    continue
            if jobs:
                print(f"[Naukri] Parsed {len(jobs)} jobs from HTML cards")
                return jobs
        return jobs

    def _norm(self, item: dict) -> Optional[Job]:
        title = (item.get("title") or "").strip()
        if not title:
            return None
        company = (item.get("companyName") or "Company").strip()
        location = salary = ""
        for ph in item.get("placeholders", []):
            if ph.get("type") == "location":
                location = ph.get("label", "")
            if ph.get("type") == "salary":
                salary = ph.get("label", "")
        job_id = str(item.get("jobId", ""))
        url = item.get("jdURL") or f"https://www.naukri.com/job-listings-{job_id}"
        if url and not url.startswith("http"):
            url = f"https://www.naukri.com{url}"
        skills = [s.strip() for s in (item.get("tagsAndSkills") or "").split(",") if s.strip()]
        desc = (item.get("jobDescription") or title)
        if salary:
            desc += f" | Salary: {salary}"
        is_remote = bool(re.search(r"remote|wfh|work from home", location, re.IGNORECASE))
        return self.normalizer.normalize({
            "id": job_id or re.sub(r"\s+", "-", title.lower())[:60],
            "title": title,
            "company": company,
            "company_logo": item.get("logoPathV3"),
            "location": location or "India",
            "salary": salary or None,
            "employment_type": "full-time",
            "work_mode": "remote" if is_remote else "onsite",
            "description": desc[:500],
            "skills": skills[:15],
            "apply_url": url,
            "posted_date": item.get("footerPlaceholderLabel"),
        }, self.name)

    def _card(self, card: str) -> Optional[Job]:
        title = self._re(r'class="[^"]*(?:title|designation)[^"]*"[^>]*>(.*?)</(?:a|h)', card)
        if not title:
            return None
        company = self._re(r'class="[^"]*(?:subTitle|comp-name)[^"]*"[^>]*>(.*?)</a>', card)
        loc_raw = self._re(r'class="[^"]*location[^"]*"[^>]*>(.*?)</span>', card)
        location = self._clean(loc_raw) if loc_raw else "India"
        sal_raw = self._re(r'class="[^"]*salary[^"]*"[^>]*>(.*?)</span>', card)
        salary = self._clean(sal_raw) if sal_raw else None
        href = self._re(r'href="(https://www\.naukri\.com/job-listings[^"]+)"', card)
        is_remote = bool(re.search(r"remote|wfh", location, re.IGNORECASE))
        slug = re.sub(r"[^a-z0-9\-]", "", (href or title).lower().replace(" ", "-"))[:80]
        return self.normalizer.normalize({
            "id": slug, "title": self._clean(title),
            "company": self._clean(company) if company else "Company",
            "location": location, "salary": salary, "employment_type": "full-time",
            "work_mode": "remote" if is_remote else "onsite",
            "description": f"Location: {location}" + (f" | Salary: {salary}" if salary else ""),
            "skills": [], "apply_url": href or "https://www.naukri.com",
        }, self.name)

    # ── helpers ───────────────────────────────────────────────────────────────

    def _keyword(self, p: CandidateProfile) -> str:
        return p.desired_job_title.strip() or "software developer"

    def _location(self, p: CandidateProfile) -> str:
        return p.preferred_locations[0].strip() if p.preferred_locations else ""

    def _re(self, pattern: str, text: str) -> Optional[str]:
        m = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
        return m.group(1).strip() if m else None

    def _clean(self, text: str) -> str:
        t = re.sub(r"<[^>]+>", "", text)
        t = t.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
        return re.sub(r"\s+", " ", re.sub(r"&#\d+;", "", t)).strip()
