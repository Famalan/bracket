#!/bin/bash

# Переходим в корневую директорию backend
cd ../

# Создаем виртуальное окружение, если его нет
if [ ! -d "venv" ]; then
    python3.11 -m venv venv
fi

# Активируем виртуальное окружение
source venv/bin/activate

# Обновляем pip
pip install --upgrade pip

# Устанавливаем зависимости
pip install -r requirements.txt

# Проверяем зависимости для бэкапов
./scripts/check_backup_deps.sh

echo "Зависимости успешно установлены" 