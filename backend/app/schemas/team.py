from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class TeamBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=50)
    description: Optional[str] = None
    logo_url: Optional[str] = None

class TeamCreate(TeamBase):
    pass

class TeamUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=50)
    description: Optional[str] = None
    logo_url: Optional[str] = None

class PlayerInfo(BaseModel):
    id: int
    username: str
    nickname: Optional[str]

class Team(TeamBase):
    id: int
    captain_id: int
    captain_name: str
    created_at: datetime
    updated_at: datetime
    players: Optional[List[PlayerInfo]] = []
    players_count: Optional[int] = 0
    tournaments_count: Optional[int] = 0

    class Config:
        from_attributes = True 