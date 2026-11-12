import pytest
from httpx import AsyncClient
from fastapi import HTTPException
from backend.app.core.dependencies import get_admin_user, get_current_user
from backend.app.models.user import User
from datetime import datetime


@pytest.mark.asyncio
async def test_get_admin_user_regular_user():
    user = User(
        id=1,
        username="testuser",
        email="test@example.com",
        hashed_password="hash",
        is_admin=False,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    try:
        await get_admin_user(user=user)
        assert False, "Should have raised HTTPException"
    except HTTPException as e:
        assert e.status_code == 403


@pytest.mark.asyncio
async def test_get_admin_user_none_user():
    try:
        await get_admin_user(user=None)
        assert False, "Should have raised HTTPException"
    except HTTPException as e:
        assert e.status_code == 403


@pytest.mark.asyncio
async def test_get_admin_user_admin():
    user = User(
        id=1,
        username="admin",
        email="admin@example.com",
        hashed_password="hash",
        is_admin=True,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    result = await get_admin_user(user=user)
    assert result == user


@pytest.mark.asyncio
async def test_get_current_user_none():
    try:
        await get_current_user(user=None)
        assert False, "Should have raised HTTPException"
    except HTTPException as e:
        assert e.status_code == 401


@pytest.mark.asyncio
async def test_get_current_user_valid():
    user = User(
        id=1,
        username="testuser",
        email="test@example.com",
        hashed_password="hash",
        is_admin=False,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    result = await get_current_user(user=user)
    assert result == user
