import logging
from datetime import datetime, timedelta
from typing import Optional, Dict
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.db.session import get_db
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Настройки безопасности
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Проверка пароля"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Получение хеша пароля"""
    return pwd_context.hash(password)

def create_access_token(data: Dict, expires_delta: Optional[timedelta] = None) -> str:
    """Создание JWT токена"""
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(
        to_encode, 
        settings.SECRET_KEY, 
        algorithm=settings.ALGORITHM
    )

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    """Получение текущего пользователя из токена"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Не удалось проверить учетные данные",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        logger.info("Декодируем токен...")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        logger.info(f"ID пользователя из токена: {user_id}")
        
        if user_id is None:
            logger.error("ID пользователя отсутствует в токене")
            raise credentials_exception
            
        # Преобразуем строку в число
        user_id = int(user_id)
    except (JWTError, ValueError) as e:
        logger.error(f"Ошибка при обработке токена: {e}")
        raise credentials_exception
    
    query = text("""
        SELECT 
            id,
            username,
            email,
            role,
            is_active,
            created_at,
            updated_at
        FROM users
        WHERE id = :user_id
    """)
    
    try:
        logger.info(f"Выполняем запрос для получения пользователя с ID {user_id}")
        result = await db.execute(query, {"user_id": user_id})
        user = result.fetchone()
        
        if user is None:
            logger.error(f"Пользователь с ID {user_id} не найден")
            raise credentials_exception
            
        if not user.is_active:
            logger.error(f"Пользователь с ID {user_id} неактивен")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пользователь неактивен"
            )
        
        logger.info(f"Пользователь найден: {user}")
        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,
            "created_at": user.created_at,
            "updated_at": user.updated_at
        }
    except Exception as e:
        logger.error(f"Ошибка при получении пользователя: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка базы данных: {str(e)}"
        ) 