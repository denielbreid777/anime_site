import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import SecretStr
from backend.app.crud.user import registration, login
from backend.app.schemas.user import UserRegistr, UserLogin


@pytest.mark.asyncio
async def test_registration_duplicate_username(test_session: AsyncSession):
    user_data = UserRegistr(username="testuser", email="test1@example.com", password="12Ukrain34!")
    await registration(user_data, test_session)

    user_data2 = UserRegistr(username="testuser", email="test2@example.com", password="12Ukrain34!")
    token = await registration(user_data2, test_session)
    assert token is None


@pytest.mark.asyncio
async def test_registration_duplicate_email(test_session: AsyncSession):
    user_data = UserRegistr(username="user1", email="same@example.com", password="12Ukrain34!")
    await registration(user_data, test_session)

    user_data2 = UserRegistr(username="user2", email="same@example.com", password="12Ukrain34!")
    token = await registration(user_data2, test_session)
    assert token is None


@pytest.mark.asyncio
async def test_login_nonexistent_user(test_session: AsyncSession):
    login_data = UserLogin(username="nonexistent", email="nonexistent@example.com", password=SecretStr("12Ukrain34!"))
    token = await login(login_data, test_session)
    assert token is None


@pytest.mark.asyncio
async def test_login_wrong_password(test_session: AsyncSession):
    user_data = UserRegistr(username="testuser", email="test@example.com", password="12Ukrain34!")
    await registration(user_data, test_session)

    login_data = UserLogin(username="testuser", email="test@example.com", password=SecretStr("WrongPassword123!"))
    token = await login(login_data, test_session)
    assert token is None
