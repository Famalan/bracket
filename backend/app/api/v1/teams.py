from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from typing import List
from app.db.session import get_db
from app.schemas.team import TeamCreate, Team, TeamUpdate
from app.schemas.user import User
from app.core.security import get_current_user
from app.models.user import UserRole

router = APIRouter()

@router.get("/", response_model=List[Team])
async def get_teams(
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    """Получение списка команд"""
    query = text("""
        SELECT 
            t.id,
            t.name,
            t.description,
            t.logo_url,
            t.created_at,
            t.updated_at,
            u.username as captain_name,
            COUNT(p.id) as players_count,
            COUNT(DISTINCT tt.tournament_id) as tournaments_count
        FROM teams t
        LEFT JOIN users u ON t.captain_id = u.id
        LEFT JOIN players p ON t.id = p.team_id
        LEFT JOIN tournament_teams tt ON t.id = tt.team_id
        GROUP BY t.id, u.username
        ORDER BY t.created_at DESC
        LIMIT :limit OFFSET :skip
    """)
    
    result = await db.execute(query, {"limit": limit, "skip": skip})
    return result.fetchall()

@router.post("/", response_model=Team)
async def create_team(
    team: TeamCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создание новой команды"""
    query = text("""
        INSERT INTO teams (name, description, logo_url, captain_id)
        VALUES (:name, :description, :logo_url, :captain_id)
        RETURNING *
    """)
    
    try:
        # Создаем команду
        result = await db.execute(
            query,
            {
                "name": team.name,
                "description": team.description,
                "logo_url": team.logo_url,
                "captain_id": current_user.id
            }
        )
        team_data = result.fetchone()
        
        # Добавляем капитана как игрока
        player_query = text("""
            INSERT INTO players (user_id, team_id, nickname)
            VALUES (:user_id, :team_id, :nickname)
        """)
        
        await db.execute(
            player_query,
            {
                "user_id": current_user.id,
                "team_id": team_data.id,
                "nickname": current_user.username
            }
        )
        
        await db.commit()
        return team_data
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Ошибка создания команды")

@router.get("/{team_id}", response_model=Team)
async def get_team(team_id: int, db: AsyncSession = Depends(get_db)):
    """Получение информации о команде"""
    query = text("""
        SELECT 
            t.*,
            u.username as captain_name,
            json_agg(json_build_object(
                'id', p.id,
                'username', pu.username,
                'nickname', p.nickname
            )) as players
        FROM teams t
        LEFT JOIN users u ON t.captain_id = u.id
        LEFT JOIN players p ON t.id = p.team_id
        LEFT JOIN users pu ON p.user_id = pu.id
        WHERE t.id = :team_id
        GROUP BY t.id, u.username
    """)
    
    result = await db.execute(query, {"team_id": team_id})
    team = result.fetchone()
    
    if not team:
        raise HTTPException(status_code=404, detail="Команда не найдена")
    return team

@router.put("/{team_id}", response_model=Team)
async def update_team(
    team_id: int,
    team_update: TeamUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Обновление информации о команде"""
    # Проверяем права доступа
    query = text("SELECT captain_id FROM teams WHERE id = :team_id")
    result = await db.execute(query, {"team_id": team_id})
    team = result.fetchone()
    
    if not team:
        raise HTTPException(status_code=404, detail="Команда не найдена")
        
    if (current_user.role != UserRole.ADMIN and 
        current_user.id != team.captain_id):
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    
    update_data = team_update.dict(exclude_unset=True)
    set_values = ", ".join(f"{k} = :{k}" for k in update_data.keys())
    
    query = text(f"""
        UPDATE teams
        SET {set_values}
        WHERE id = :team_id
        RETURNING *
    """)
    
    try:
        result = await db.execute(query, {**update_data, "team_id": team_id})
        await db.commit()
        return result.fetchone()
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Ошибка обновления команды")

@router.delete("/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_team(
    team_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Удаление команды"""
    # Проверяем права доступа
    query = text("SELECT captain_id FROM teams WHERE id = :team_id")
    result = await db.execute(query, {"team_id": team_id})
    team = result.fetchone()
    
    if not team:
        raise HTTPException(status_code=404, detail="Команда не найдена")
        
    if (current_user.role != UserRole.ADMIN and 
        current_user.id != team.captain_id):
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    
    query = text("DELETE FROM teams WHERE id = :team_id")
    
    try:
        await db.execute(query, {"team_id": team_id})
        await db.commit()
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Ошибка удаления команды")