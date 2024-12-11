from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum

class TournamentType(str, Enum):
    SINGLE_ELIMINATION = "single_elimination"
    DOUBLE_ELIMINATION = "double_elimination"
    ROUND_ROBIN = "round_robin"

class TournamentStatus(str, Enum):
    REGISTRATION = "registration"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class TournamentBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    description: Optional[str] = None
    type: TournamentType
    rules: Optional[str] = None
    max_teams: int = Field(..., ge=2, le=64)
    registration_deadline: datetime
    start_date: datetime
    end_date: datetime

class TournamentCreate(TournamentBase):
    pass

class TournamentUpdate(TournamentBase):
    pass

class Tournament(TournamentBase):
    id: int
    status: TournamentStatus
    created_by: int
    created_at: datetime
    updated_at: datetime
    organizer_name: Optional[str] = None

    class Config:
        from_attributes = True 