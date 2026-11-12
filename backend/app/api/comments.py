from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.app.models.user import User
from backend.app.core.dependencies import get_current_user
from backend.app.schemas.comment import CommentCreate, CommentUpdate, CommentResponse
from backend.app.crud import comment as crud
from backend.app.crud import post as post_crud


router = APIRouter(tags=["Comments"])


# Всі коментарі до поста
@router.get("/posts/{post_id}/comments",
            response_model=list[CommentResponse],
            status_code=status.HTTP_200_OK,
            responses={
                status.HTTP_400_BAD_REQUEST: {"description": "Invalid post ID"},
                status.HTTP_404_NOT_FOUND: {"description": "Post not found"},
            })
async def list_comments_route(post_id: int, db: AsyncSession = Depends(get_db)):
    if post_id <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid post ID")

    post = await post_crud.get_post(post_id, db)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    return await crud.get_comments(post_id, db)


# Створення коментаря
@router.post("/posts/{post_id}/comments",
             response_model=CommentResponse,
             status_code=status.HTTP_201_CREATED,
             responses={
                 status.HTTP_400_BAD_REQUEST: {"description": "Invalid post ID"},
                 status.HTTP_401_UNAUTHORIZED: {"description": "Token is required"},
                 status.HTTP_404_NOT_FOUND: {"description": "Post not found"},
                 status.HTTP_422_UNPROCESSABLE_CONTENT: {"description": "Data validation error"},
             })
async def create_comment_route(post_id: int, data: CommentCreate,
                               user: User = Depends(get_current_user),
                               db: AsyncSession = Depends(get_db)):
    if post_id <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid post ID")

    post = await post_crud.get_post(post_id, db)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    return await crud.create_comment(data, post_id, user.id, db)


# Редагування
@router.patch("/comments/{comment_id}",
              response_model=CommentResponse,
              status_code=status.HTTP_200_OK,
              responses={
                  status.HTTP_400_BAD_REQUEST: {"description": "Invalid comment ID"},
                  status.HTTP_401_UNAUTHORIZED: {"description": "Token is required"},
                  status.HTTP_403_FORBIDDEN: {"description": "You can edit only your own comments"},
                  status.HTTP_404_NOT_FOUND: {"description": "Comment not found"},
                  status.HTTP_422_UNPROCESSABLE_CONTENT: {"description": "Data validation error"},
              })
async def update_comment_route(comment_id: int, data: CommentUpdate,
                               user: User = Depends(get_current_user),
                               db: AsyncSession = Depends(get_db)):
    if comment_id <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid comment ID")

    comment = await crud.get_comment(comment_id, db)
    if not comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")

    if comment.author_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can edit only your own comments")

    return await crud.update_comment(comment, data, db)


# Видалення
@router.delete("/comments/{comment_id}",
               status_code=status.HTTP_204_NO_CONTENT,
               responses={
                   status.HTTP_400_BAD_REQUEST: {"description": "Invalid comment ID"},
                   status.HTTP_401_UNAUTHORIZED: {"description": "Token is required"},
                   status.HTTP_403_FORBIDDEN: {"description": "You can delete only your own comments"},
                   status.HTTP_404_NOT_FOUND: {"description": "Comment not found"},
               })
async def delete_comment_route(comment_id: int,
                               user: User = Depends(get_current_user),
                               db: AsyncSession = Depends(get_db)):
    if comment_id <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid comment ID")

    comment = await crud.get_comment(comment_id, db)
    if not comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")

    if comment.author_id != user.id and not user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can delete only your own comments")

    await crud.delete_comment(comment, db)