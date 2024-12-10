from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Киберспортивные турниры"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # База данных
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "tournament_db"
    POSTGRES_PORT: str = "5432"
    
    # Безопасность
    SECRET_KEY: str = "your-secret-key"  # Измените на реальный секретный ключ
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Бэкапы
    BACKUP_DIR: str = "backups"
    BACKUP_RETENTION_DAYS: int = 30  # Хранить бэкапы 30 дней
    ENABLE_SCHEDULED_BACKUPS: bool = True
    
    @property
    def database_url(self) -> str:
        """Получить URL для подключения к базе данных"""
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )
    
    class Config:
        env_file = ".env"

settings = Settings() 