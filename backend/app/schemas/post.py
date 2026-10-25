
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

from backend.app.models.post import PostType


#  Звичайний пост
class PostCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    content: str = Field(min_length=1)


# Рецензія + аніме і рейтинг (обов'язкові)
class ReviewCreate(PostCreate):
    anime_id: int
    rating: int = Field(ge=1, le=10) #- біьше менше 1 і 10


#Фан-арт
class FanartCreate(PostCreate):
    image_url: str = Field(max_length=500)
    anime_id: int | None = None


class PostUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    content: str | None = Field(default=None, min_length=1)

class PostAuthor(BaseModel):
    id: int
    username: str
    model_config = ConfigDict(from_attributes=True)


#Fy yjf ну а тут одна схема для всіх трьох видів. 
# У звичайного поста rating і image_url просто будуть null, 
# а фронт буде за полем type вирішути, як показувати пост.

class PostResponse(BaseModel):
    id: int
    type: PostType
    title: str
    content: str
    anime_id: int | None
    rating: int | None
    image_url: str | None
    author: PostAuthor
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)