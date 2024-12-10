#!/bin/bash

# Активируем виртуальное окружение
source venv/bin/activate

# Переходим в корневую директорию backend
cd ../

# Запускаем сервер через uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload 