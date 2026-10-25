from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.app.schemas.user import UserRegistr, UserLogin
from backend.app.models.user import User
from backend.app.core.security import get_password_hash, create_token, verify_password



async def registration(user: UserRegistr, db: AsyncSession):
    existing_user = (await db.execute(
        select(User).where((User.username == user.username) | (User.email == user.email))
    )).scalar_one_or_none()

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


async def login(user: UserLogin, db: AsyncSession):
    existing_user = (await db.execute(
        select(User).where((User.username == user.username) | (User.email == user.username))
    )).scalar_one_or_none()
    if not existing_user:
        return None

    password = user.password.get_secret_value() if hasattr(user.password, 'get_secret_value') else user.password
    if verify_password(password, existing_user.hashed_password):
        token = create_token(existing_user.id)
        return token

    return None

