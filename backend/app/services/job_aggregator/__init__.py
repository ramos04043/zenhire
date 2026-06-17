"""
Production-ready Job Aggregation Engine for ZenHire
"""

from .job_aggregator_service import JobAggregatorService
from .types import CandidateProfile, Job, RankedJob, AggregationResult

__all__ = ['JobAggregatorService', 'CandidateProfile', 'Job', 'RankedJob', 'AggregationResult']
