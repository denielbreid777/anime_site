from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.comment import Comment
from app.schemas.comment import CommentCreate, CommentUpdate


async def get_comments(post_id: int, db: AsyncSession):
    comments = (await db.execute(
        select(Comment).where(Comment.post_id == post_id).order_by(Comment.created_at)
    )).scalars().all()
    return comments


async def get_comment(comment_id: int, db: AsyncSession):
    comment = (await db.execute(
        select(Comment).where(Comment.id == comment_id)
    )).scalar_one_or_none()
    return comment


async def create_comment(data: CommentCreate, post_id: int, author_id: int, db: AsyncSession):
    new_comment = Comment(
        content=data.content,
        post_id=post_id,
        author_id=author_id,
    )
    db.add(new_comment)
    await db.commit()
    await db.refresh(new_comment)
    return new_comment


async def update_comment(comment: Comment, data: CommentUpdate, db: AsyncSession):
    comment.content = data.content
    await db.commit()
    await db.refresh(comment)
    return comment


async def delete_comment(comment: Comment, db: AsyncSession):
    await db.delete(comment)
    await db.commit()