from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Киберспортивные турниры"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "tournament_db"
    POSTGRES_PORT: str = "5432"
    
    SECRET_KEY: str = "your-secret-key-here"  # В продакшене использовать безопасный ключ
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 часа
    
    class Config:
        env_file = ".env"

settings = Settings() 