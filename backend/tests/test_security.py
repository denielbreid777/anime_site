import pytest
from datetime import datetime, timedelta, timezone
from jose import jwt

from backend.app.core.security import get_password_hash, verify_password, create_token, decode_token


@pytest.mark.asyncio
async def test_password_hash_not_equal():
    password = "testPassword123"
    hashed = get_password_hash(password)
    assert password != hashed


@pytest.mark.asyncio
async def test_verify_password_correct():
    password = "testPassword123"
    hashed = get_password_hash(password)
    assert verify_password(password, hashed) is True


@pytest.mark.asyncio
async def test_verify_password_incorrect():
    password = "testPassword123"
    wrong_password = "wrongPassword456"
    hashed = get_password_hash(password)
    assert verify_password(wrong_password, hashed) is False


@pytest.mark.asyncio
async def test_create_and_decode_token():
    user_id = 42
    token = create_token(user_id)
    decoded_id = decode_token(token)
    assert decoded_id == user_id


@pytest.mark.asyncio
async def test_decode_garbage_token():
    assert decode_token("garbage_token_string") is None


@pytest.mark.asyncio
async def test_decode_token_wrong_key():
    from backend.app.core.config import settings
    payload = {"sub": "42", "exp": datetime.now(timezone.utc) + timedelta(minutes=30)}
    token = jwt.encode(payload, "wrong_secret_key")
    assert decode_token(token) is None


@pytest.mark.asyncio
async def test_decode_expired_token():
    from backend.app.core.config import settings
    payload = {"sub": "42", "exp": datetime.now(timezone.utc) - timedelta(minutes=30)}
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    assert decode_token(token) is None


@pytest.mark.asyncio
async def test_decode_token_without_sub():
    from backend.app.core.config import settings
    payload = {"exp": datetime.now(timezone.utc) + timedelta(minutes=30)}
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    assert decode_token(token) is None


@pytest.mark.asyncio
async def test_decode_token_with_non_numeric_sub():
    from backend.app.core.config import settings
    payload = {"sub": "abc", "exp": datetime.now(timezone.utc) + timedelta(minutes=30)}
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    assert decode_token(token) is None
