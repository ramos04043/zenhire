from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    GROQ_API_KEY: Optional[str] = None
    # ZendBX credentials — used only to download files from ZendBX storage
    ZENDBX_ANON_KEY: Optional[str] = None
    ZENDBX_PROJECT_ID: Optional[str] = None
    ZENDBX_PROJECT_SLUG: Optional[str] = None
    JOOBLE_API_KEY: Optional[str] = None
    
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
