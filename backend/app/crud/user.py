from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.schemas.user import UserRegistr, UserLogin
from app.models.user import User
from app.core.security import get_password_hash, create_token, verify_password



async def registration(user: UserRegistr, db: AsyncSession):
    existing_user = (await db.execute(select(User).where(User.username == user.username))).scalar_one_or_none()

    if existing_user:
        return None

    raw_password = user.password.get_secret_value()
    hashed_password = get_password_hash(raw_password)

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    token = create_token(new_user.id)

    return token


async def login(user, db: AsyncSession):
    existing_user = (await db.execute(
        select(User).where(
            or_(User.email == user.username, User.username == user.username)))).scalar_one_or_none()

    if not existing_user:
        return None

    if verify_password(user.password, existing_user.hashed_password):
        return create_token(existing_user.id)

    return None

