# ZenHire Job Aggregation Engine

## Overview
Production-ready Tier 1 Job Aggregation Engine with modular provider-based architecture.

## Architecture

### Core Components
- **JobAggregatorService**: Main orchestrator
- **JobNormalizer**: Converts raw jobs to unified format
- **JobDeduplicator**: Removes duplicates using similarity matching
- **JobRanker**: AI-powered job ranking based on candidate profile

### Providers (8 Total)
1. **Remotive** - Remote job board API
2. **Arbeitnow** - European job board
3. **Greenhouse** - ATS job boards
4. **Lever** - ATS job boards  
5. **Ashby** - ATS job boards
6. **Workable** - ATS job boards
7. **Jooble** - Global job aggregator
8. **Adzuna** - Multi-country job search

## Features

### ✅ Parallel Execution
- All providers run concurrently using `asyncio.gather()`
- Target response time: <5 seconds
- Graceful degradation if providers fail

### ✅ Normalization
- Unified `Job` model across all providers
- Automatic field mapping and cleanup
- Skill extraction from descriptions

### ✅ Deduplication
- Multi-stage deduplication:
  1. Exact matching (company + title + location)
  2. Fuzzy matching using Levenshtein distance
  3. URL similarity comparison
- Keeps most complete job data

### ✅ AI Ranking
- Match scoring based on:
  - Skill Match (35%)
  - Experience Match (20%)
  - Location Match (20%)
  - Work Mode Match (15%)
  - Salary Match (10%)
- Returns match reasons and missing skills

### ✅ Caching
- 15-minute TTL
- LRU eviction (max 100 entries)
- Cache key based on profile attributes

### ✅ Error Handling
- Provider failures don't stop aggregation
- Partial results returned
- Detailed error logging

### ✅ Logging
- Provider execution time
- Jobs returned per provider
- Deduplication stats
- Summary table

## Usage

```python
from app.services.job_aggregator import JobAggregatorService, CandidateProfile

aggregator = JobAggregatorService()

profile = CandidateProfile(
    desired_job_title="Software Engineer",
    skills=["Python", "JavaScript", "React"],
    experience_level="mid",
    preferred_locations=["Remote", "New York"],
    work_mode="remote",
    employment_type="full-time"
)

result = await aggregator.search_jobs(profile)

print(f"Found {result.total_jobs} jobs")
print(f"Top match: {result.jobs[0].title} at {result.jobs[0].company} ({result.jobs[0].match_score}%)")
```

## API Integration

### Endpoint: POST /api/jobs/aggregate
```json
{
  "desired_job_title": "Software Engineer",
  "skills": ["Python", "React"],
  "experience_level": "mid",
  "preferred_locations": ["Remote"],
  "work_mode": "remote"
}
```

### Response:
```json
{
  "jobs": [
    {
      "id": "remotive-12345",
      "provider": "Remotive",
      "title": "Senior Software Engineer",
      "company": "TechCorp",
      "location": "Remote",
      "salary": "$120k - $150k",
      "match_score": 92,
      "matching_skills": ["Python", "React"],
      "missing_skills": ["TypeScript"],
      "apply_url": "https://..."
    }
  ],
  "total_jobs": 45,
  "execution_time": 3200,
  "deduplicated_count": 12,
  "providers": ["Remotive", "Arbeitnow", "Greenhouse", ...]
}
```

## Adding New Providers

1. Create `providers/NewProvider.py`
2. Implement `JobProvider` interface
3. Add to `JobAggregatorService` providers list

```python
class NewProvider(JobProvider):
    name = "NewProvider"
    
    async def search_jobs(self, profile: CandidateProfile) -> List[Job]:
        # Fetch jobs
        # Transform to Job model
        # Return list
        pass
```

## Configuration

### Environment Variables
```bash
JOOBLE_API_KEY=your_key_here
ADZUNA_APP_ID=your_app_id
ADZUNA_APP_KEY=your_app_key
```

### Cache Settings
```python
aggregator.cache_ttl = 20 * 60  # 20 minutes
```

## Performance

- Concurrent provider execution
- Caching reduces API calls
- Efficient deduplication algorithm
- Typical execution: 2-4 seconds

## Testing

```bash
python -m pytest tests/test_job_aggregator.py
```

## Production Checklist

- [ ] Configure API keys for Jooble and Adzuna
- [ ] Set up Redis for distributed caching
- [ ] Add rate limiting per provider
- [ ] Implement retry logic
- [ ] Add monitoring/alerts
- [ ] Enable logging to file/service
