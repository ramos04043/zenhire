from abc import ABC, abstractmethod
from typing import List
import httpx
from ..types import StartupJob, StartupCandidateProfile


class BaseStartupProvider(ABC):
    """Base class for all startup job providers"""
    
    def __init__(self):
        self.timeout = httpx.Timeout(30.0)
        self.client = httpx.AsyncClient(timeout=self.timeout)
    
    @property
    @abstractmethod
    def name(self) -> str:
        """Provider name"""
        pass
    
    @abstractmethod
    async def search_jobs(self, profile: StartupCandidateProfile) -> List[StartupJob]:
        """Search jobs based on candidate profile"""
        pass
    
    async def close(self):
        """Close HTTP client"""
        await self.client.aclose()
    
    def __del__(self):
        """Cleanup"""
        try:
            import asyncio
            asyncio.create_task(self.close())
        except:
            pass
