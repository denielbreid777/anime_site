from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from app.models.user import User
from app.core.dependencies import get_current_user
from app.schemas.post import PostCreate, ReviewCreate, FanartCreate, PostUpdate, PostResponse
from app.crud import post as crud


router = APIRouter(tags=["Posts"])

# Всі пости
@router.get("/posts",
    response_model=list[PostResponse],
    responses={
        status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Database error"}
    })
async def list_posts_route(db: AsyncSession = Depends(get_db)):
    try:
        return await crud.get_posts(db)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error")


# пост один
@router.get("/posts/{post_id}",
        response_model=PostResponse,
        responses={
            status.HTTP_404_NOT_FOUND: {"description": "Post not found"},
            status.HTTP_400_BAD_REQUEST: {"description": "Invalid post ID"},
            status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Database error"}
        })
async def get_post_route(post_id: int, db: AsyncSession = Depends(get_db)):
    if post_id <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid post ID")
    try:
        post = await crud.get_post(post_id, db)
        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
        return post
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error")


# 3 різні види створення
@router.post("/posts",
        response_model=PostResponse,
        status_code=status.HTTP_201_CREATED,
        responses={
            status.HTTP_401_UNAUTHORIZED: {"description": "Token is required"},
            status.HTTP_422_UNPROCESSABLE_CONTENT: {"description": "Validation error"},
            status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Database error"}
        })
async def create_post_route(data: PostCreate, user: User = Depends(get_current_user),db: AsyncSession = Depends(get_db)):
    try:
        return await crud.create_post(data, user.id, db)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error")


@router.post("/reviews",
    response_model=PostResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_401_UNAUTHORIZED: {"description": "Token is required"},
        status.HTTP_422_UNPROCESSABLE_CONTENT: {"description": "Validation error"},
        status.HTTP_400_BAD_REQUEST: {"description": "Invalid anime ID"},
        status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Database error"}
    })
async def create_review_route(data: ReviewCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    try:
        return await crud.create_review(data, user.id, db)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error")


@router.post("/fanart",
             response_model=PostResponse,
             status_code=status.HTTP_201_CREATED,
             responses={
                 status.HTTP_401_UNAUTHORIZED: {"description": "Token is required"},
                 status.HTTP_422_UNPROCESSABLE_CONTENT: {"description": "Validation error"},
                 status.HTTP_400_BAD_REQUEST: {"description": "Invalid anime ID"},
                 status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Database error"}
             })
async def create_fanart_route(data: FanartCreate, user: User = Depends(get_current_user),db: AsyncSession = Depends(get_db)):
    try:
        return await crud.create_fanart(data, user.id, db)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error")


# Редагування
@router.patch("/posts/{post_id}",
              response_model=PostResponse,
              responses={
                  status.HTTP_401_UNAUTHORIZED: {"description": "Token is required"},
                  status.HTTP_403_FORBIDDEN: {"description": "You can edit only your own posts"},
                  status.HTTP_404_NOT_FOUND: {"description": "Post not found"},
                  status.HTTP_400_BAD_REQUEST: {"description": "Invalid post ID"},
                  status.HTTP_422_UNPROCESSABLE_CONTENT: {"description": "Validation error"},
                  status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Database error"}
              })
async def update_post_route(post_id: int, data: PostUpdate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if post_id <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid post ID")
    try:
        post = await crud.get_post(post_id, db)
        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
        if post.author_id != user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can edit only your own posts")
        return await crud.update_post(post, data, db)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error")


#  Видаленя
@router.delete("/posts/{post_id}",
               status_code=status.HTTP_204_NO_CONTENT,
               responses={
                   status.HTTP_401_UNAUTHORIZED: {"description": "Token is required"},
                   status.HTTP_403_FORBIDDEN: {"description": "You can delete only your own posts"},
                   status.HTTP_404_NOT_FOUND: {"description": "Post not found"},
                   status.HTTP_400_BAD_REQUEST: {"description": "Invalid post ID"},
                   status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Database error"}
               })
async def delete_post_route(post_id: int, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if post_id <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid post ID")
    try:
        post = await crud.get_post(post_id, db)
        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
        if post.author_id != user.id and not user.is_admin:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can delete only your own posts")
        await crud.delete_post(post, db)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error")