import pytest
from httpx import AsyncClient

from backend.app.core.security import create_token


@pytest.mark.asyncio
async def test_me_valid_token(client: AsyncClient):
    await client.post(
        "/account/register",
        json={"username": "testuser", "email": "test@example.com", "password": "12Ukrain34!"}
    )
    login_response = await client.post(
        "/account/login",
        data={"username": "testuser", "password": "12Ukrain34!"}
    )
    token = login_response.json()["access_token"]
    response = await client.get("/account/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert "username" in data
    assert "email" in data
    assert "is_admin" in data
    assert "hashed_password" not in data
    assert "password" not in data


@pytest.mark.asyncio
async def test_me_no_token(client: AsyncClient):
    response = await client.get("/account/me")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_me_invalid_token(client: AsyncClient):
    response = await client.get("/account/me", headers={"Authorization": "Bearer invalid_token"})
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_me_expired_token(client: AsyncClient):
    from datetime import datetime, timedelta, timezone
    from jose import jwt
    from backend.app.core.config import settings
    payload = {"sub": "999", "exp": datetime.now(timezone.utc) - timedelta(minutes=30)}
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    response = await client.get("/account/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_me_nonexistent_user_token(client: AsyncClient):
    token = create_token(999999)
    response = await client.get("/account/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_me_token_with_non_numeric_sub(client: AsyncClient):
    from datetime import datetime, timedelta, timezone
    from jose import jwt
    from backend.app.core.config import settings
    payload = {"sub": "abc", "exp": datetime.now(timezone.utc) + timedelta(minutes=30)}
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    response = await client.get("/account/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401
