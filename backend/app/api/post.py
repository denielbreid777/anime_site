from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.app.models.user import User
from backend.app.core.dependencies import get_current_user
from backend.app.schemas.post import PostCreate, ReviewCreate, FanartCreate, PostUpdate, PostResponse
from backend.app.crud import post as crud


router = APIRouter(tags=["Posts"])

# Всі пости
@router.get("/posts", 
    response_model=list[PostResponse])
async def list_posts_route(db: AsyncSession = Depends(get_db)):
    return await crud.get_posts(db)


# пост один
@router.get("/posts/{post_id}", 
        response_model=PostResponse)
async def get_post_route(post_id: int, db: AsyncSession = Depends(get_db)):
    post = await crud.get_post(post_id, db)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return post


# 3 різні види створення
@router.post("/posts",
        response_model=PostResponse,
        status_code=status.HTTP_201_CREATED,
        responses={
            status.HTTP_401_UNAUTHORIZED: {"description": "Token is required"}
        })
async def create_post_route(data: PostCreate, user: User = Depends(get_current_user),db: AsyncSession = Depends(get_db)):
    return await crud.create_post(data, user.id, db)


@router.post("/reviews",
    response_model=PostResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_401_UNAUTHORIZED: {"description": "Token is required"}
    })
async def create_review_route(data: ReviewCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await crud.create_review(data, user.id, db)


@router.post("/fanart",
             response_model=PostResponse,
             status_code=status.HTTP_201_CREATED,
             responses={
                 status.HTTP_401_UNAUTHORIZED: {"description": "Token is required"}
             })
async def create_fanart_route(data: FanartCreate, user: User = Depends(get_current_user),db: AsyncSession = Depends(get_db)):
    return await crud.create_fanart(data, user.id, db)


# Редагування
@router.put("/posts/{post_id}",
              response_model=PostResponse,
              responses={
                  status.HTTP_401_UNAUTHORIZED: {"description": "Token is required"},
                  status.HTTP_403_FORBIDDEN: {"description": "You can edit only your own posts"},
                  status.HTTP_404_NOT_FOUND: {"description": "Post not found"}
              })
async def update_post_route(post_id: int, data: PostUpdate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    post = await crud.get_post(post_id, db)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    if post.author_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can edit only your own posts")
    return await crud.update_post(post, data, db)


#  Видаленя
@router.delete("/posts/{post_id}",
               status_code=status.HTTP_204_NO_CONTENT,
               responses={
                   status.HTTP_401_UNAUTHORIZED: {"description": "Token is required"},
                   status.HTTP_403_FORBIDDEN: {"description": "You can delete only your own posts"},
                   status.HTTP_404_NOT_FOUND: {"description": "Post not found"}
               })
async def delete_post_route(post_id: int, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    post = await crud.get_post(post_id, db)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    if post.author_id != user.id and not user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can delete only your own posts")
    await crud.delete_post(post, db)