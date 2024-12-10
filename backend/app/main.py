from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError
from app.api.v1 import users, tournaments, teams, matches, brackets, auth
from app.core.config import settings
from app.core.scheduler import setup_scheduler
from app.core.exceptions import TournamentException

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION
)

# Обработчики ошибок
@app.exception_handler(TournamentException)
async def tournament_exception_handler(request: Request, exc: TournamentException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    return JSONResponse(
        status_code=500,
        content={"detail": "Ошибка базы данных"}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Внутренняя ошибка сервера"}
    )

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутеров
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(tournaments.router, prefix="/api/v1/tournaments", tags=["tournaments"])
app.include_router(teams.router, prefix="/api/v1/teams", tags=["teams"])
app.include_router(matches.router, prefix="/api/v1/matches", tags=["matches"])
app.include_router(brackets.router, prefix="/api/v1/brackets", tags=["brackets"])

@app.on_event("startup")
async def startup_event():
    if settings.ENABLE_SCHEDULED_BACKUPS:
        setup_scheduler()

@app.get("/")
async def root():
    return {"message": "Добро пожаловать в API киберспортивных турниров"}