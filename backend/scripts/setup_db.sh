#!/bin/bash

# Переменные окружения для PostgreSQL
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=postgres
export POSTGRES_DB=tournament_db
export POSTGRES_PORT=5432

# Создание базы данных
echo "Создание базы данных..."
psql -U postgres -c "DROP DATABASE IF EXISTS $POSTGRES_DB;"
psql -U postgres -c "CREATE DATABASE $POSTGRES_DB;"

# Переход в корневую директорию backend
cd ../

# Активация виртуального окружения
source venv/bin/activate

# Применение миграций
echo "Применение миграций..."
alembic upgrade head

# Заполнение тестовыми данными
echo "Добавление тестовых данных..."
python -c "
import asyncio
from app.db.session import AsyncSessionLocal
from app.db.seed import seed_db

async def main():
    async with AsyncSessionLocal() as session:
        await seed_db(session)

asyncio.run(main())
"

echo "База данных успешно настроена!"