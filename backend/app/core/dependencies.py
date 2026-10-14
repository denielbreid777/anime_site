
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import Depends, HTTPException, status


from database import get_db
from lesson_23.app.core.security import decode_token
from models.user import User


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/account/login")


async def get_user(db: AsyncSession = Depends(get_db), token = Depends(oauth2_scheme)):
    user_id = decode_token(token)
    user = (await db.execute(select(User).where(User.id == user_id))).scalar_one_or_none()
    return user


async def get_admin_user(user: User = Depends(get_user)):
    if not user or not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only amin can do thHis"
        )
    return user
