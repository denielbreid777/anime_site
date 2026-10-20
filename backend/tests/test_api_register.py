import pytest
from httpx import AsyncClient

from backend.app.core.security import decode_token


@pytest.mark.asyncio
async def test_register_success(client: AsyncClient):
    response = await client.post(
        "/account/register",
        json={"username": "newuser", "email": "new@example.com", "password": "12Ukrain34!"}
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    user_id = decode_token(data["access_token"])
    assert user_id is not None


@pytest.mark.asyncio
async def test_register_duplicate_username(client: AsyncClient):
    await client.post(
        "/account/register",
        json={"username": "testuser", "email": "test1@example.com", "password": "12Ukrain34!"}
    )
    response = await client.post(
        "/account/register",
        json={"username": "testuser", "email": "test2@example.com", "password": "12Ukrain34!"}
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_register_duplicate_username_has_detail(client: AsyncClient):
    await client.post(
        "/account/register",
        json={"username": "testuser", "email": "test1@example.com", "password": "12Ukrain34!"}
    )
    response = await client.post(
        "/account/register",
        json={"username": "testuser", "email": "test2@example.com", "password": "12Ukrain34!"}
    )
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data
    assert len(data["detail"]) > 0


@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient):
    await client.post(
        "/account/register",
        json={"username": "user1", "email": "same@example.com", "password": "12Ukrain34!"}
    )
    response = await client.post(
        "/account/register",
        json={"username": "user2", "email": "same@example.com", "password": "12Ukrain34!"}
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_register_weak_password(client: AsyncClient):
    response = await client.post(
        "/account/register",
        json={"username": "newuser", "email": "new@example.com", "password": "weak"}
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_register_missing_username(client: AsyncClient):
    response = await client.post(
        "/account/register",
        json={"email": "new@example.com", "password": "12Ukrain34!"}
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_register_email_saved(client: AsyncClient):
    email = "testemail@example.com"
    register_response = await client.post(
        "/account/register",
        json={"username": "testuser", "email": email, "password": "12Ukrain34!"}
    )
    token = register_response.json()["access_token"]
    response = await client.get("/account/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == email
