from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.anime import Anime
from app.schemas.anime import AnimeCreate, AnimeUpdate


async def get_anime(anime_id: int, db: AsyncSession):
    try:
        anime = (await db.execute(select(Anime).where(Anime.id == anime_id))).scalar_one_or_none()
        return anime
    except Exception as e:
        raise Exception(f"Database error: {str(e)}")

async def get_anime_list(db: AsyncSession):
    try:
        anime_list = (await db.execute(select(Anime).order_by(Anime.title))).scalars().all()
        return anime_list
    except Exception as e:
        raise Exception(f"Database error: {str(e)}")

async def create_anime(data: AnimeCreate, db: AsyncSession):
    try:
        existing = (await db.execute(select(Anime).where(Anime.title == data.title))).scalar_one_or_none()
        if existing:
            return None

        new_anime = Anime(
            title=data.title,
            description=data.description,
            year=data.year,
            episodes=data.episodes,
            status=data.status,
            poster_url=data.poster_url,
        )

        db.add(new_anime)
        await db.commit()
        await db.refresh(new_anime)
        return new_anime
    except Exception as e:
        await db.rollback()
        raise Exception(f"Database error: {str(e)}")


async def update_anime(anime: Anime, data: AnimeUpdate, db: AsyncSession):
    try:
        if data.title is not None:
            anime.title = data.title
        if data.description is not None:
            anime.description = data.description
        if data.year is not None:
            anime.year = data.year
        if data.episodes is not None:
            anime.episodes = data.episodes
        if data.status is not None:
            anime.status = data.status
        if data.poster_url is not None:
            anime.poster_url = data.poster_url
        await db.commit()
        await db.refresh(anime)
        return anime
    except Exception as e:
        await db.rollback()
        raise Exception(f"Database error: {str(e)}")


async def delete_anime(anime: Anime, db: AsyncSession):
    try:
        await db.delete(anime)
        await db.commit()
    except Exception as e:
        await db.rollback()
        raise Exception(f"Database error: {str(e)}")





