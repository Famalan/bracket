from pydantic import BaseModel, Field, validator
from datetime import datetime, timedelta
from typing import Optional
from enum import Enum

class TournamentType(str, Enum):
    SINGLE_ELIMINATION = "single_elimination"
    DOUBLE_ELIMINATION = "double_elimination"
    ROUND_ROBIN = "round_robin"

class TournamentStatus(str, Enum):
    DRAFT = "draft"
    REGISTRATION = "registration"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class TournamentBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    description: Optional[str] = Field(None, max_length=1000)
    type: TournamentType
    rules: Optional[str] = Field(None, max_length=5000)
    max_teams: int = Field(..., ge=2, le=64)
    registration_deadline: datetime
    start_date: datetime
    end_date: datetime

    @validator('registration_deadline')
    def validate_registration_deadline(cls, v, values):
        if v <= datetime.now():
            raise ValueError("Дедлайн регистрации должен быть в будущем")
        return v

    @validator('start_date')
    def validate_start_date(cls, v, values):
        if 'registration_deadline' in values and v <= values['registration_deadline']:
            raise ValueError("Дата начала должна быть после дедлайна регистрации")
        return v

    @validator('end_date')
    def validate_end_date(cls, v, values):
        if 'start_date' in values and v <= values['start_date']:
            raise ValueError("Дата окончания должна быть после даты начала")
        if 'start_date' in values and (v - values['start_date']) > timedelta(days=30):
            raise ValueError("Турнир не может длиться более 30 дней")
        return v

class TournamentCreate(TournamentBase):
    pass

class TournamentUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=100)
    description: Optional[str] = None
    rules: Optional[str] = None
    max_teams: Optional[int] = Field(None, ge=2)
    registration_deadline: Optional[datetime] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[TournamentStatus] = None

class Tournament(TournamentBase):
    id: int
    status: TournamentStatus
    created_by: int
    created_at: datetime
    updated_at: datetime
    organizer_name: Optional[str] = None
    registered_teams: Optional[int] = 0

    class Config:
        from_attributes = True 