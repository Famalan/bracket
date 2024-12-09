from sqlalchemy import Column, String, Enum
import enum
from app.models.base import BaseModel

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    ORGANIZER = "organizer"
    PLAYER = "player"

class User(BaseModel):
    __tablename__ = "users"

    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.PLAYER) 