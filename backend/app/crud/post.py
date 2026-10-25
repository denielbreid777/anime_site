
from backend.app.models.post import Post, PostType  



async def create_post(db, data, author_id: int, post_type: PostType):
    post = Post(**data.model_dump(), author_id=author_id, type=post_type)
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return post