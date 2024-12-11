from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import create_access_token, verify_password, get_current_user
from app.db.session import get_db
from app.schemas.user import User
from sqlalchemy import text
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Ищем пользователя через чистый SQL
        query = text("""
            SELECT id, username, email, hashed_password, role 
            FROM users 
            WHERE username = :username
        """)
        
        result = await db.execute(query, {"username": form_data.username})
        user = result.fetchone()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неверное имя пользователя или пароль",
            )

        # Проверяем пароль
        if not verify_password(form_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неверное имя пользователя или пароль",
            )

        # Создаем токен
        access_token = create_access_token(data={"sub": str(user.id)})
        
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ошибка при попытке входа"
        )

@router.get("/me")
async def read_current_user(current_user: dict = Depends(get_current_user)):
    """Получение информации о текущем пользователе"""
    return current_user