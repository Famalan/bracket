from pydantic import BaseModel, EmailStr
from typing import Optional
from app.models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role: Optional[UserRole] = UserRole.PLAYER

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDBBase(UserBase):
    id: int
    role: UserRole

    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass

class UserInDB(UserInDBBase):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[int] = None 