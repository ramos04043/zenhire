#!/usr/bin/env python3
"""
Quick test script for Startup Jobs functionality
Run with: python test_startup_jobs.py
"""

import asyncio
import sys
from app.services.startup_jobs import (
    StartupJobAggregator,
    StartupCompanyRegistry,
    StartupCandidateProfile,
    StartupStage,
    IndustryCategory
)

async def test_company_registry():
    """Test company registry"""
    print("=" * 60)
    print("Testing Company Registry")
    print("=" * 60)
    
    # Get all companies
    companies = StartupCompanyRegistry.get_all_companies()
    print(f"\n✓ Total companies in registry: {len(companies)}")
    
    # Get YC companies
    yc_companies = StartupCompanyRegistry.get_yc_companies()
    print(f"✓ YC companies: {len(yc_companies)}")
    
    # Get AI companies
    ai_companies = StartupCompanyRegistry.get_companies_by_industry(IndustryCategory.AI_ML)
    print(f"✓ AI/ML companies: {len(ai_companies)}")
    
    # Test specific company lookup
    openai = StartupCompanyRegistry.get_company("OpenAI")
    if openai:
        print(f"\n✓ Found OpenAI:")
        print(f"  - Stage: {openai.stage.value}")
        print(f"  - Team Size: {openai.team_size}")
        print(f"  - Funding: ${openai.funding_amount:,}" if openai.funding_amount else "  - Funding: N/A")
        print(f"  - YC Company: {openai.is_yc_company}")
        print(f"  - Industries: {', '.join([i.value for i in openai.industries])}")
        print(f"  - Tech Stack: {', '.join(openai.tech_stack[:5])}")
    
    print("\n✓ Company Registry Test: PASSED\n")

async def test_job_aggregator():
    """Test job aggregator"""
    print("=" * 60)
    print("Testing Job Aggregator")
    print("=" * 60)
    
    # Create test profile
    profile = StartupCandidateProfile(
        desired_job_title="Software Engineer",
        skills=["Python", "React", "TypeScript", "PostgreSQL"],
        experience_level="mid",
        preferred_locations=["Remote", "San Francisco"],
        work_mode="remote",
        preferred_startup_stages=[StartupStage.SEED, StartupStage.SERIES_A],
        preferred_industries=[IndustryCategory.AI_ML, IndustryCategory.DEVELOPER_TOOLS],
        preferred_tech_stack=["Python", "React"],
        equity_important=True,
        visa_sponsorship_required=False
    )
    
    print("\n✓ Created candidate profile:")
    print(f"  - Job Title: {profile.desired_job_title}")
    print(f"  - Skills: {', '.join(profile.skills)}")
    print(f"  - Experience: {profile.experience_level}")
    print(f"  - Work Mode: {profile.work_mode}")
    print(f"  - Preferred Stages: {', '.join([s.value for s in profile.preferred_startup_stages])}")
    print(f"  - Preferred Industries: {', '.join([i.value for i in profile.preferred_industries])}")
    
    # Create aggregator
    aggregator = StartupJobAggregator()
    
    print("\n✓ Initialized aggregator with providers:")
    for provider in aggregator.providers:
        print(f"  - {provider.name}")
    
    print("\n⏳ Fetching jobs from all providers...")
    print("  (This may take 30-60 seconds depending on API responses)\n")
    
    try:
        # Aggregate jobs
        result = await aggregator.aggregate_jobs(profile, use_cache=False)
        
        print("=" * 60)
        print("Results Summary")
        print("=" * 60)
        print(f"\n✓ Total jobs found: {result.total_jobs}")
        print(f"✓ Unique startups: {result.startup_count}")
        print(f"✓ YC companies: {result.yc_company_count}")
        print(f"✓ Jobs deduplicated: {result.deduplicated_count}")
        print(f"✓ Execution time: {result.execution_time:.2f}s")
        print(f"✓ Providers used: {', '.join(result.providers)}")
        
        if result.errors:
            print(f"\n⚠ Provider errors:")
            for provider, error in result.errors.items():
                print(f"  - {provider}: {error}")
        
        # Show top 5 jobs
        if result.jobs:
            print(f"\n" + "=" * 60)
            print("Top 5 Matched Jobs")
            print("=" * 60)
            
            for i, job in enumerate(result.jobs[:5], 1):
                print(f"\n{i}. {job.title} at {job.company}")
                print(f"   Match Score: {job.match_score}%")
                print(f"   Location: {job.location} ({job.work_mode})")
                if job.startup_stage:
                    print(f"   Stage: {job.startup_stage.value}")
                if job.team_size:
                    print(f"   Team Size: {job.team_size}")
                if job.is_yc_company:
                    print(f"   🔥 YC Company")
                if job.is_dream_company:
                    print(f"   ⭐ Dream Company")
                if job.match_reason:
                    print(f"   Reasons: {', '.join(job.match_reason)}")
                if job.tech_stack:
                    print(f"   Tech: {', '.join(job.tech_stack[:5])}")
        
        print("\n✓ Job Aggregator Test: PASSED\n")
        
        # Cleanup
        await aggregator.close()
        
    except Exception as e:
        print(f"\n✗ Error during aggregation: {e}")
        import traceback
        traceback.print_exc()
        await aggregator.close()
        return False
    
    return True

async def main():
    """Run all tests"""
    print("\n" + "=" * 60)
    print("ZenHire Startup Jobs Module Test Suite")
    print("=" * 60 + "\n")
    
    try:
        # Test company registry
        await test_company_registry()
        
        # Test job aggregator
        success = await test_job_aggregator()
        
        if success:
            print("=" * 60)
            print("✓ ALL TESTS PASSED")
            print("=" * 60)
            print("\nThe Startup Jobs module is ready to use!")
            print("\nNext steps:")
            print("1. Start the backend: cd backend && uvicorn app.main:app --reload")
            print("2. Start the frontend: cd frontend && npm run dev")
            print("3. Navigate to /startup-jobs or /dream-companies")
            print()
            return 0
        else:
            print("\n✗ Some tests failed")
            return 1
            
    except Exception as e:
        print(f"\n✗ Test suite failed: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
