
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

from backend.app.models.anime import AnimeStatus


# Рое тоже тільки Адні адмін
class AnimeCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255, examples=["Attack on Titan"])
    description: str = Field(min_length=1, examples=["Люди воюють з тітанами..."])
    year: int = Field(ge=1900, le=2100, examples=[2013])
    episodes: int | None = Field(default=None, ge=1, examples=[87])
    status: AnimeStatus = Field(default=AnimeStatus.announced)
    poster_url: str | None = Field(default=None, max_length=500)

#Kbh Лиш адмін може
class AnimeUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = Field(default=None, min_length=1)
    year: int | None = Field(default=None, ge=1900, le=2100)
    episodes: int | None = Field(default=None, ge=1)
    status: AnimeStatus | None = None
    poster_url: str | None = Field(default=None, max_length=500)



class AnimeResponse(BaseModel):
    id: int
    title: str
    description: str
    year: int
    episodes: int | None
    status: AnimeStatus
    poster_url: str | None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)