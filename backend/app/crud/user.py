from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.schemas.user import UserRegistr, UserLogin
from app.models.user import User
from app.core.security import get_password_hash, create_token, verify_password



async def registration(user: UserRegistr, db: AsyncSession):
    try:
        print("start registration in crud")
        existing_user = (await db.execute(
            select(User).where((User.username == user.username) | (User.email == user.email))
        )).scalar_one_or_none()

        if existing_user:
            print("user already exists")
            return None

        print("user does not exist, creating new user")
        raw_password = user.password.get_secret_value()
        print("raw password", raw_password)
        hashed_password = get_password_hash(raw_password)
        print("hashed password", hashed_password)

        new_user = User(
            username=user.username,
            email=user.email,
            hashed_password=hashed_password
        )

        print("new user created", new_user)

        db.add(new_user)
        print("user added to session")
        await db.commit()
        print("user committed to database")
        await db.refresh(new_user)
        print("user refreshed")

        token = create_token(new_user.id)
        print("token created", token)

        return token
    except Exception as e:
        print("exception occurred", e)
        await db.rollback()
        print("rolled back")
        raise Exception(f"Database error: {str(e)}")


async def login(user: UserLogin, db: AsyncSession):
    try:
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
    except Exception as e:
        raise Exception(f"Database error: {str(e)}")

