from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from typing import List
from datetime import datetime
from app.db.session import get_db
from app.schemas.tournament import TournamentCreate, Tournament, TournamentUpdate
from app.schemas.user import User
from app.core.security import get_current_user

router = APIRouter()

@router.post("/", response_model=Tournament)
async def create_tournament(
    tournament: TournamentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Создание нового турнира"""
    query = text("""
        INSERT INTO tournaments (
            name, description, type, status, rules,
            max_teams, registration_deadline, start_date,
            end_date, created_by
        ) VALUES (
            :name, :description, :type, 'registration', :rules,
            :max_teams, :registration_deadline, :start_date,
            :end_date, :created_by
        )
        RETURNING 
            id, name, description, type, status, rules,
            max_teams, registration_deadline, start_date,
            end_date, created_by, created_at, updated_at
    """)
    
    try:
        result = await db.execute(
            query,
            {
                **tournament.model_dump(),
                "created_by": current_user["id"]
            }
        )
        await db.commit()
        return result.fetchone()
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Ошибка при создании турнира: {str(e)}"
        )

@router.get("/", response_model=List[Tournament])
async def get_tournaments(
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    """Получение списка турниров"""
    query = text("""
        SELECT 
            t.id,
            t.name,
            t.description,
            t.type,
            t.status,
            t.rules,
            t.max_teams,
            t.registration_deadline,
            t.start_date,
            t.end_date,
            t.created_at,
            t.updated_at,
            t.created_by,
            u.username as organizer_name
        FROM tournaments t
        LEFT JOIN users u ON t.created_by = u.id
        ORDER BY t.created_at DESC
        LIMIT :limit OFFSET :skip
    """)
    
    result = await db.execute(query, {"limit": limit, "skip": skip})
    return result.fetchall()

@router.get("/{tournament_id}", response_model=Tournament)
async def get_tournament(
    tournament_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Получение информации о турнире"""
    query = text("""
        SELECT 
            t.*,
            u.username as organizer_name,
            COUNT(DISTINCT tt.team_id) as registered_teams
        FROM tournaments t
        LEFT JOIN users u ON t.created_by = u.id
        LEFT JOIN tournament_teams tt ON t.id = tt.tournament_id
        WHERE t.id = :tournament_id
        GROUP BY t.id, u.username
    """)
    
    result = await db.execute(query, {"tournament_id": tournament_id})
    tournament = result.fetchone()
    
    if not tournament:
        raise HTTPException(status_code=404, detail="Турнир не найден")
    return tournament

@router.put("/{tournament_id}", response_model=Tournament)
async def update_tournament(
    tournament_id: int,
    tournament_update: TournamentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Обновление информации о турнире"""
    # Проверяем права доступа
    query = text("SELECT created_by FROM tournaments WHERE id = :tournament_id")
    result = await db.execute(query, {"tournament_id": tournament_id})
    tournament = result.fetchone()
    
    if not tournament:
        raise HTTPException(status_code=404, detail="Турнир не найден")
        
    if (current_user.role != UserRole.ADMIN and 
        current_user.id != tournament.created_by):
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    
    update_data = tournament_update.dict(exclude_unset=True)
    set_values = ", ".join(f"{k} = :{k}" for k in update_data.keys())
    
    query = text(f"""
        UPDATE tournaments
        SET {set_values}
        WHERE id = :tournament_id
        RETURNING *
    """)
    
    try:
        result = await db.execute(query, {**update_data, "tournament_id": tournament_id})
        await db.commit()
        return result.fetchone()
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Ошибка обновления турнира")

@router.delete("/{tournament_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tournament(
    tournament_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Удаление турнира"""
    # Проверяем права доступа
    query = text("SELECT created_by FROM tournaments WHERE id = :tournament_id")
    result = await db.execute(query, {"tournament_id": tournament_id})
    tournament = result.fetchone()
    
    if not tournament:
        raise HTTPException(status_code=404, detail="Турнир не найден")
        
    if (current_user.role != UserRole.ADMIN and 
        current_user.id != tournament.created_by):
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    
    query = text("DELETE FROM tournaments WHERE id = :tournament_id")
    
    try:
        await db.execute(query, {"tournament_id": tournament_id})
        await db.commit()
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Ошибка удаления турнира")