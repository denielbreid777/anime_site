from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.post import Post, PostType
from app.schemas.post import PostCreate, ReviewCreate, FanartCreate, PostUpdate






async def create_post(data: PostCreate, author_id: int, db: AsyncSession):
    try:
        new_post = Post(
            title=data.title,
            content=data.content,
            author_id=author_id,
            type=PostType.post,
        )
        db.add(new_post)
        await db.commit()
        await db.refresh(new_post)
        return new_post
    except Exception as e:
        await db.rollback()
        raise Exception(f"Database error: {str(e)}")


async def create_review(data: ReviewCreate, author_id: int, db: AsyncSession):
    try:
        new_post = Post(
            title=data.title,
            content=data.content,
            author_id=author_id,
            type=PostType.review,
            anime_id=data.anime_id,
            rating=data.rating,
        )
        db.add(new_post)
        await db.commit()
        await db.refresh(new_post)
        return new_post
    except Exception as e:
        await db.rollback()
        raise Exception(f"Database error: {str(e)}")



async def create_fanart(data: FanartCreate, author_id: int, db: AsyncSession):
    try:
        new_post = Post(
            title=data.title,
            content=data.content,
            author_id=author_id,
            type=PostType.fanart,
            anime_id=data.anime_id,
            image_url=data.image_url,
        )
        db.add(new_post)
        await db.commit()
        await db.refresh(new_post)
        return new_post
    except Exception as e:
        await db.rollback()
        raise Exception(f"Database error: {str(e)}")






async def get_post(post_id: int, db: AsyncSession):
    try:
        post = (await db.execute(select(Post).where(Post.id == post_id))).scalar_one_or_none()
        return post
    except Exception as e:
        raise Exception(f"Database error: {str(e)}")

async def get_posts(db: AsyncSession):
    try:
        posts = (await db.execute(select(Post).order_by(Post.created_at.desc()))).scalars().all()
        return posts
    except Exception as e:
        raise Exception(f"Database error: {str(e)}")




async def update_post(post: Post, data: PostUpdate, db: AsyncSession):
    try:
        if data.title is not None:
            post.title = data.title
        if data.content is not None:
            post.content = data.content

        await db.commit()
        await db.refresh(post)
        return post
    except Exception as e:
        await db.rollback()
        raise Exception(f"Database error: {str(e)}")







async def delete_post(post: Post, db: AsyncSession):
    try:
        await db.delete(post)
        await db.commit()
    except Exception as e:
        await db.rollback()
        raise Exception(f"Database error: {str(e)}")