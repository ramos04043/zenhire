import requests
from typing import List, Dict, Any
import time
from bs4 import BeautifulSoup
import urllib.parse
import random

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
}


def fetch_remotive(role: str, max_results: int = 10) -> List[Dict[str, Any]]:
    """
    Remotive public REST API — no auth, returns remote tech jobs.
    Docs: https://remotive.com/api/remote-jobs
    """
    jobs = []
    try:
        resp = requests.get(
            "https://remotive.com/api/remote-jobs",
            params={"search": role, "limit": max_results},
            headers=HEADERS,
            timeout=15,
        )
        if not resp.ok:
            print(f"[remotive] HTTP {resp.status_code}")
            return jobs

        data = resp.json()
        for item in data.get("jobs", [])[:max_results]:
            jobs.append({
                "title": item.get("title", ""),
                "company": item.get("company_name", "Unknown"),
                "location": item.get("candidate_required_location") or "Remote",
                "salary": item.get("salary") or None,
                "summary": item.get("job_type", ""),
                "url": item.get("url", ""),
                "source": "Remotive",
            })
        print(f"[remotive] got {len(jobs)} jobs")
    except Exception as e:
        print(f"[remotive] error: {e}")
    return jobs


def fetch_arbeitnow(role: str, location: str = "", max_results: int = 10) -> List[Dict[str, Any]]:
    """
    Arbeitnow free job board API — no auth required.
    Docs: https://www.arbeitnow.com/api/job-board-api
    """
    jobs = []
    try:
        params: Dict[str, Any] = {"search": role, "page": 1}
        if location and location.lower() not in ("remote", "worldwide"):
            params["location"] = location

        resp = requests.get(
            "https://www.arbeitnow.com/api/job-board-api",
            params=params,
            headers=HEADERS,
            timeout=15,
        )
        if not resp.ok:
            print(f"[arbeitnow] HTTP {resp.status_code}")
            return jobs

        data = resp.json()
        for item in data.get("data", [])[:max_results]:
            tags = item.get("tags", [])
            jobs.append({
                "title": item.get("title", ""),
                "company": item.get("company_name", "Unknown"),
                "location": item.get("location", location or "Remote"),
                "salary": None,
                "summary": ", ".join(tags[:4]) if tags else item.get("description", "")[:150],
                "url": item.get("url", ""),
                "source": "Arbeitnow",
            })
        print(f"[arbeitnow] got {len(jobs)} jobs")
    except Exception as e:
        print(f"[arbeitnow] error: {e}")
    return jobs


def fetch_jooble(role: str, location: str = "", api_key: str = "", max_results: int = 10) -> List[Dict[str, Any]]:
    """
    Jooble REST API — requires a free API key from https://jooble.org/api/about
    Falls back gracefully if no key configured.
    """
    jobs = []
    if not api_key:
        print("[jooble] no API key configured, skipping")
        return jobs
    try:
        resp = requests.post(
            f"https://jooble.org/api/{api_key}",
            json={"keywords": role, "location": location or "", "page": "1"},
            headers={**HEADERS, "Content-Type": "application/json"},
            timeout=15,
        )
        if not resp.ok:
            print(f"[jooble] HTTP {resp.status_code}")
            return jobs

        data = resp.json()
        for item in data.get("jobs", [])[:max_results]:
            jobs.append({
                "title": item.get("title", ""),
                "company": item.get("company", "Unknown"),
                "location": item.get("location", location or "Remote"),
                "salary": item.get("salary") or None,
                "summary": item.get("snippet", "")[:200],
                "url": item.get("link", ""),
                "source": "Jooble",
            })
        print(f"[jooble] got {len(jobs)} jobs")
    except Exception as e:
        print(f"[jooble] error: {e}")
    return jobs


def search_jobs(
    role: str,
    location: str = "Remote",
    job_type: str = "full-time",
    experience_level: str = "mid",
    max_results: int = 15,
    jooble_api_key: str = "",
    include_linkedin: bool = True,
    include_indeed: bool = True,
) -> List[Dict[str, Any]]:
    """
    Aggregate jobs from multiple free APIs and scraping sources.
    Sources: Remotive, Arbeitnow, Jooble (if key provided), LinkedIn, Indeed.
    """
    all_jobs: List[Dict[str, Any]] = []

    # 1. Remotive — great for remote/tech roles
    remotive_jobs = fetch_remotive(role, max_results=max_results)
    all_jobs.extend(remotive_jobs)

    # 2. Arbeitnow — broader job board
    time.sleep(0.5)
    arbeitnow_jobs = fetch_arbeitnow(role, location, max_results=max_results)
    all_jobs.extend(arbeitnow_jobs)

    # 3. Jooble (optional, needs free API key)
    if jooble_api_key:
        time.sleep(0.5)
        jooble_jobs = fetch_jooble(role, location, jooble_api_key, max_results=max_results)
        all_jobs.extend(jooble_jobs)

    # 4. LinkedIn (scraping)
    if include_linkedin:
        time.sleep(random.uniform(2, 4))  # Longer delay for LinkedIn
        linkedin_jobs = fetch_linkedin(role, location, max_results=max_results)
        all_jobs.extend(linkedin_jobs)

    # 5. Indeed (scraping)
    if include_indeed:
        time.sleep(random.uniform(1, 3))  # Random delay for Indeed
        indeed_jobs = fetch_indeed(role, location, max_results=max_results)
        all_jobs.extend(indeed_jobs)

    # Dedupe by title + company
    seen = set()
    unique: List[Dict[str, Any]] = []
    for job in all_jobs:
        key = f"{job['title'].lower().strip()}|{job['company'].lower().strip()}"
        if key not in seen and job["title"]:
            seen.add(key)
            unique.append(job)

    print(f"[scraper] total unique jobs: {len(unique)}")
    
    # Return all unique jobs (don't limit here, let frontend handle pagination)
    # This ensures jobs from all sources are included
    return unique


def fetch_linkedin(role: str, location: str = "", max_results: int = 10) -> List[Dict[str, Any]]:
    """
    Scrape LinkedIn jobs using search URL and BeautifulSoup.
    Note: LinkedIn has anti-bot measures, so this may be rate-limited.
    """
    jobs = []
    try:
        # Construct LinkedIn jobs search URL
        base_url = "https://www.linkedin.com/jobs/search"
        params = {
            "keywords": role,
            "location": location or "United States",
            "f_TPR": "r86400",  # Past 24 hours
            "f_JT": "F",  # Full-time
            "start": 0
        }
        
        url = f"{base_url}?" + urllib.parse.urlencode(params)
        
        # Add random delay to appear more human-like
        time.sleep(random.uniform(1, 3))
        
        session = requests.Session()
        session.headers.update(HEADERS)
        
        resp = session.get(url, timeout=20)
        if not resp.ok:
            print(f"[linkedin] HTTP {resp.status_code}")
            return jobs

        soup = BeautifulSoup(resp.content, 'html.parser')
        
        # Find job cards - LinkedIn uses specific CSS classes
        job_cards = soup.find_all('div', class_='job-search-card') or soup.find_all('div', {'data-entity-urn': True})
        
        if not job_cards:
            # Try alternative selectors
            job_cards = soup.find_all('li', class_='result-card') or soup.find_all('div', class_='base-card')
        
        for card in job_cards[:max_results]:
            try:
                # Extract job title
                title_elem = card.find('h3', class_='base-search-card__title') or card.find('a', class_='result-card__full-card-link')
                title = title_elem.get_text(strip=True) if title_elem else ""
                
                # Extract company name
                company_elem = card.find('h4', class_='base-search-card__subtitle') or card.find('h3', class_='result-card__subtitle')
                company = company_elem.get_text(strip=True) if company_elem else "Unknown"
                
                # Extract location
                location_elem = card.find('span', class_='job-search-card__location') or card.find('span', class_='job-result-card__location')
                job_location = location_elem.get_text(strip=True) if location_elem else location or "Remote"
                
                # Extract job URL
                link_elem = card.find('a', href=True)
                job_url = link_elem['href'] if link_elem else ""
                if job_url and not job_url.startswith('http'):
                    job_url = "https://www.linkedin.com" + job_url
                
                # Extract summary/snippet
                summary_elem = card.find('p', class_='job-search-card__snippet') or card.find('div', class_='job-search-card__snippet')
                summary = summary_elem.get_text(strip=True)[:200] if summary_elem else ""
                
                if title and company:
                    jobs.append({
                        "title": title,
                        "company": company,
                        "location": job_location,
                        "salary": None,  # LinkedIn rarely shows salary in search results
                        "summary": summary,
                        "url": job_url,
                        "source": "LinkedIn",
                    })
                    
            except Exception as e:
                print(f"[linkedin] error parsing card: {e}")
                continue
                
        print(f"[linkedin] got {len(jobs)} jobs")
    except Exception as e:
        print(f"[linkedin] error: {e}")
    return jobs


def fetch_indeed(role: str, location: str = "", max_results: int = 10) -> List[Dict[str, Any]]:
    """
    Scrape Indeed jobs using search URL and BeautifulSoup.
    Indeed has anti-bot measures - using enhanced headers and session.
    """
    jobs = []
    try:
        # Construct Indeed search URL
        base_url = "https://www.indeed.com/jobs"
        params = {
            "q": role,
            "l": location or "United States",
            "fromage": "1",  # Past day
            "limit": min(max_results, 50)  # Indeed shows max 50 per page
        }
        
        url = f"{base_url}?" + urllib.parse.urlencode(params)
        
        # Add random delay
        time.sleep(random.uniform(1, 3))
        
        # Enhanced headers to avoid 403
        session = requests.Session()
        enhanced_headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "DNT": "1",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "Cache-Control": "max-age=0",
        }
        session.headers.update(enhanced_headers)
        
        # Try with cookies to appear more legitimate
        session.cookies.set('CTK', 'random_token_' + str(random.randint(1000, 9999)))
        
        resp = session.get(url, timeout=25, allow_redirects=True)
        
        if resp.status_code == 403:
            print(f"[indeed] HTTP 403 - blocked by anti-bot. Try with proxy or reduce frequency.")
            return jobs
            
        if not resp.ok:
            print(f"[indeed] HTTP {resp.status_code}")
            return jobs

        soup = BeautifulSoup(resp.content, 'html.parser')
        
        # Find job cards - Indeed uses these classes
        job_cards = soup.find_all('div', class_='job_seen_beacon')
        
        if not job_cards:
            # Try alternative selectors
            job_cards = soup.find_all('td', class_='resultContent')
        
        if not job_cards:
            # Try another alternative
            job_cards = soup.find_all('div', {'data-jk': True})
        
        if not job_cards:
            print(f"[indeed] No job cards found. Page structure may have changed.")
            return jobs
        
        for card in job_cards[:max_results]:
            try:
                # Extract job title
                title_elem = card.find('h2', class_='jobTitle')
                if not title_elem:
                    title_elem = card.find('a', {'data-jk': True})
                
                if title_elem:
                    title_link = title_elem.find('a') or title_elem
                    title = title_link.get_text(strip=True) if title_link else ""
                    job_url = title_link.get('href', '') if hasattr(title_link, 'get') else ""
                else:
                    title = ""
                    job_url = ""
                
                # Extract company name
                company_elem = card.find('span', class_='companyName')
                if not company_elem:
                    company_elem = card.find('div', class_='companyName')
                
                if company_elem:
                    company_link = company_elem.find('a') or company_elem
                    company = company_link.get_text(strip=True) if company_link else "Unknown"
                else:
                    company = "Unknown"
                
                # Extract location
                location_elem = card.find('div', class_='companyLocation')
                if not location_elem:
                    location_elem = card.find('span', class_='locationsContainer')
                job_location = location_elem.get_text(strip=True) if location_elem else location or "Remote"
                
                # Extract salary if available
                salary_elem = card.find('span', class_='salaryText')
                if not salary_elem:
                    salary_elem = card.find('div', class_='salary-snippet')
                salary = salary_elem.get_text(strip=True) if salary_elem else None
                
                # Extract job summary
                summary_elem = card.find('div', class_='job-snippet')
                if not summary_elem:
                    summary_elem = card.find('ul') or card.find('div', class_='jobCardShelfContainer')
                summary = summary_elem.get_text(strip=True)[:200] if summary_elem else ""
                
                # Fix job URL
                if job_url and not job_url.startswith('http'):
                    if job_url.startswith('/'):
                        job_url = "https://www.indeed.com" + job_url
                    else:
                        job_url = "https://www.indeed.com/" + job_url
                
                if title and company:
                    jobs.append({
                        "title": title,
                        "company": company,
                        "location": job_location,
                        "salary": salary,
                        "summary": summary,
                        "url": job_url,
                        "source": "Indeed",
                    })
                    
            except Exception as e:
                print(f"[indeed] error parsing card: {e}")
                continue
                
        print(f"[indeed] got {len(jobs)} jobs")
    except requests.exceptions.RequestException as e:
        print(f"[indeed] request error: {e}")
    except Exception as e:
        print(f"[indeed] error: {e}")
    return jobs