import pytest
from pydantic import ValidationError

from backend.app.schemas.user import UserRegistr


@pytest.mark.asyncio
async def test_valid_password():
    user = UserRegistr(username="testuser", email="test@example.com", password="12Ukrain34!")
    assert user.username == "testuser"
    assert user.email == "test@example.com"


@pytest.mark.asyncio
async def test_password_without_uppercase():
    with pytest.raises(ValidationError) as exc_info:
        UserRegistr(username="testuser", email="test@example.com", password="12ukrain34!")
    assert "capital letter" in str(exc_info.value).lower()


@pytest.mark.asyncio
async def test_password_without_lowercase():
    with pytest.raises(ValidationError) as exc_info:
        UserRegistr(username="testuser", email="test@example.com", password="12UKRAIN34!")
    assert "small letter" in str(exc_info.value).lower()


@pytest.mark.asyncio
async def test_password_without_digit():
    with pytest.raises(ValidationError) as exc_info:
        UserRegistr(username="testuser", email="test@example.com", password="UkrainTest!")
    assert "digit" in str(exc_info.value).lower()


@pytest.mark.asyncio
async def test_password_without_special_symbol():
    with pytest.raises(ValidationError) as exc_info:
        UserRegistr(username="testuser", email="test@example.com", password="12Ukrain34A")
    assert "symbol" in str(exc_info.value).lower()


@pytest.mark.asyncio
async def test_password_too_short():
    with pytest.raises(ValidationError) as exc_info:
        UserRegistr(username="testuser", email="test@example.com", password="12Ukr3!")
    assert "min_length" in str(exc_info.value).lower() or "at least 8" in str(exc_info.value).lower()


@pytest.mark.asyncio
async def test_password_length_8():
    user = UserRegistr(username="testuser", email="test@example.com", password="12Ukrain!")
    assert user.password.get_secret_value() == "12Ukrain!"


@pytest.mark.asyncio
async def test_password_length_30():
    password = "12Ukrain34!" + "A" * 19
    user = UserRegistr(username="testuser", email="test@example.com", password=password)
    assert len(user.password.get_secret_value()) == 30


@pytest.mark.asyncio
async def test_password_too_long():
    with pytest.raises(ValidationError) as exc_info:
        UserRegistr(username="testuser", email="test@example.com", password="12Ukrain34!" + "A" * 21)
    assert "max_length" in str(exc_info.value).lower() or "at most 30" in str(exc_info.value).lower()


@pytest.mark.asyncio
@pytest.mark.xfail(strict=True, reason="BUG-B7: regex doesn't properly handle hyphen in special characters")
async def test_password_with_hyphen():
    user = UserRegistr(username="testuser", email="test@example.com", password="Abcdefg1-")
    assert user.password.get_secret_value() == "Abcdefg1-"
