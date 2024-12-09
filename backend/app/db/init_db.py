from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.user import User, UserRole
from app.core.security import get_password_hash

def init_db(db: Session) -> None:
    # Создаем администратора по умолчанию
    admin = db.query(User).filter(User.email == "admin@example.com").first()
    if not admin:
        admin = User(
            email="admin@example.com",
            hashed_password=get_password_hash("admin"),
            role=UserRole.ADMIN
        )
        db.add(admin)
        db.commit()
        db.refresh(admin) 