
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.app.models.user import User
from backend.app.core.dependencies import get_current_user
from backend.app.schemas.anime import AnimeCreate, AnimeUpdate, AnimeResponse
from backend.app.crud import anime as crud


router = APIRouter(prefix="/anime", tags=["Anime"])


# вмдлно всім анімешки
@router.get("", response_model=list[AnimeResponse],
            responses={
                status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Database error"}
            })
async def list_anime_route(db: AsyncSession = Depends(get_db)):
    try:
        return await crud.get_anime_list(db)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error")

@router.get("/{anime_id}",
            response_model=AnimeResponse,
            responses={
                status.HTTP_404_NOT_FOUND: {"description": "Anime not found"},
                status.HTTP_400_BAD_REQUEST: {"description": "Invalid anime ID"},
                status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Database error"}
            })
async def get_anime_route(anime_id: int, db: AsyncSession = Depends(get_db)):
    if anime_id <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid anime ID")
    try:
        anime = await crud.get_anime(anime_id, db)
        if not anime:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Anime not found")
        return anime
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error")

# Cjpf  Созданіе - адмін
@router.post("", response_model=AnimeResponse, status_code=status.HTTP_201_CREATED,
             responses={
                 status.HTTP_401_UNAUTHORIZED: {"description": "Token is required"},
                 status.HTTP_403_FORBIDDEN: {"description": "Only admin can add anime"},
                 status.HTTP_400_BAD_REQUEST: {"description": "Anime with this title already exists or invalid data"},
                 status.HTTP_422_UNPROCESSABLE_CONTENT: {"description": "Validation error"},
                 status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Database error"}
             })
async def create_anime_route(data: AnimeCreate, user: User = Depends(get_current_user),
                             db: AsyncSession = Depends(get_db)):
    if not user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin can add anime")

    try:
        anime = await crud.create_anime(data, db)
        if not anime:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Anime with this title already exists")
        return anime
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error")



# Редагування - адмін
@router.patch("/{anime_id}", response_model=AnimeResponse,
               responses={
                   status.HTTP_401_UNAUTHORIZED: {"description": "Token is required"},
                   status.HTTP_403_FORBIDDEN: {"description": "Only admin can edit anime"},
                   status.HTTP_404_NOT_FOUND: {"description": "Anime not found"},
                   status.HTTP_400_BAD_REQUEST: {"description": "Invalid anime ID"},
                   status.HTTP_422_UNPROCESSABLE_CONTENT: {"description": "Validation error"},
                   status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Database error"}
               })
async def update_anime_route(anime_id: int, data: AnimeUpdate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if not user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin can edit anime")

    if anime_id <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid anime ID")

    try:
        anime = await crud.get_anime(anime_id, db)
        if not anime:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Anime not found")
        return await crud.update_anime(anime, data, db)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error")



# Видалення - адмін
@router.delete("/{anime_id}", status_code=status.HTTP_204_NO_CONTENT,
               responses={
                   status.HTTP_401_UNAUTHORIZED: {"description": "Token is required"},
                   status.HTTP_403_FORBIDDEN: {"description": "Only admin can delete anime"},
                   status.HTTP_404_NOT_FOUND: {"description": "Anime not found"},
                   status.HTTP_400_BAD_REQUEST: {"description": "Invalid anime ID"},
                   status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Database error"}
               })
async def delete_anime_route(anime_id: int, user: User = Depends(get_current_user),
                             db: AsyncSession = Depends(get_db)):
    if not user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin can delete anime")

    if anime_id <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid anime ID")

    try:
        anime = await crud.get_anime(anime_id, db)
        if not anime:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Anime not found")
        await crud.delete_anime(anime, db)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error")
