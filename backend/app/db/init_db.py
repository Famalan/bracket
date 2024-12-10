from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User, UserRole
from app.core.security import get_password_hash
from sqlalchemy import text

async def init_db(db: AsyncSession) -> None:
    try:
        # Проверяем, существует ли уже admin
        query = text("SELECT * FROM users WHERE username = :username")
        result = await db.execute(query, {"username": "admin"})
        admin = result.fetchone()

        if not admin:
            # Создаем администратора
            admin_user = User(
                username="admin",
                email="admin@example.com",
                hashed_password=get_password_hash("admin"),
                role=UserRole.ADMIN,
                is_active=True
            )
            db.add(admin_user)

            # Создаем тестовых организаторов
            organizers = [
                User(
                    username=f"organizer{i}",
                    email=f"organizer{i}@example.com",
                    hashed_password=get_password_hash("organizer"),
                    role=UserRole.ORGANIZER,
                    is_active=True
                )
                for i in range(1, 3)
            ]
            for org in organizers:
                db.add(org)

            # Создаем тестовых игроков
            players = [
                User(
                    username=f"player{i}",
                    email=f"player{i}@example.com",
                    hashed_password=get_password_hash("player"),
                    role=UserRole.PLAYER,
                    is_active=True
                )
                for i in range(1, 5)
            ]
            for player in players:
                db.add(player)

            await db.commit()
            print("База данных инициализирована")
        else:
            print("База данных уже инициализирована")

    except Exception as e:
        print(f"Ошибка при инициализации базы данных: {e}")
        await db.rollback()
        raise