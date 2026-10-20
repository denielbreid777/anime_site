import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_login_with_username(client: AsyncClient):
    await client.post(
        "/account/register",
        json={"username": "testuser", "email": "test@example.com", "password": "12Ukrain34!"}
    )
    response = await client.post(
        "/account/login",
        data={"username": "testuser", "password": "12Ukrain34!"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data


@pytest.mark.asyncio
@pytest.mark.xfail(strict=True, reason="BUG-B3: login only works with username, not email")
async def test_login_with_email(client: AsyncClient):
    await client.post(
        "/account/register",
        json={"username": "testuser", "email": "test@example.com", "password": "12Ukrain34!"}
    )
    response = await client.post(
        "/account/login",
        data={"username": "test@example.com", "password": "12Ukrain34!"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data


@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient):
    await client.post(
        "/account/register",
        json={"username": "testuser", "email": "test@example.com", "password": "12Ukrain34!"}
    )
    response = await client.post(
        "/account/login",
        data={"username": "testuser", "password": "WrongPassword123!"}
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_login_nonexistent_user(client: AsyncClient):
    response = await client.post(
        "/account/login",
        data={"username": "nonexistent", "password": "12Ukrain34!"}
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_login_wrong_password_has_detail(client: AsyncClient):
    await client.post(
        "/account/register",
        json={"username": "testuser", "email": "test@example.com", "password": "12Ukrain34!"}
    )
    response = await client.post(
        "/account/login",
        data={"username": "testuser", "password": "WrongPassword123!"}
    )
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data
    assert len(data["detail"]) > 0
