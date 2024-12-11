from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import UserRole
from app.core.security import get_password_hash
from sqlalchemy import text

async def init_db(db: AsyncSession) -> None:
    try:
        # Проверяем, существует ли уже admin
        query = text("SELECT * FROM users WHERE username = :username")
        result = await db.execute(query, {"username": "admin"})
        admin = result.fetchone()

        if not admin:
            # SQL запрос для вставки пользователя
            insert_query = text("""
                INSERT INTO users (username, email, hashed_password, role, is_active)
                VALUES (:username, :email, :hashed_password, :role, :is_active)
            """)

            # Создаем администратора
            await db.execute(
                insert_query,
                {
                    "username": "admin",
                    "email": "admin@example.com",
                    "hashed_password": get_password_hash("admin"),
                    "role": UserRole.ADMIN,
                    "is_active": True
                }
            )

            # Создаем тестовых организаторов
            for i in range(1, 3):
                await db.execute(
                    insert_query,
                    {
                        "username": f"organizer{i}",
                        "email": f"organizer{i}@example.com",
                        "hashed_password": get_password_hash("organizer"),
                        "role": UserRole.ORGANIZER,
                        "is_active": True
                    }
                )

            # Создаем тестовых игроков
            for i in range(1, 5):
                await db.execute(
                    insert_query,
                    {
                        "username": f"player{i}",
                        "email": f"player{i}@example.com",
                        "hashed_password": get_password_hash("player"),
                        "role": UserRole.PLAYER,
                        "is_active": True
                    }
                )

            await db.commit()
            print("База данных инициализирована")
        else:
            print("База данных уже инициализирована")

    except Exception as e:
        print(f"Ошибка при инициализации базы данных: {e}")
        await db.rollback()
        raise