import pytest
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.pool import StaticPool
from httpx import AsyncClient, ASGITransport

from backend.database import Base, get_db
from backend.main import app


TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture(scope="function")
async def test_engine():
    engine = create_async_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest.fixture(scope="function")
async def test_session(test_engine):
    async_session = async_sessionmaker(
        bind=test_engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    async with async_session() as session:
        yield session


@pytest.fixture(scope="function")
async def client(test_session):
    async def override_get_db():
        yield test_session

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
async def create_user(client: AsyncClient):
    async def _create_user(username: str, email: str, password: str):
        response = await client.post(
            "/account/register",
            json={"username": username, "email": email, "password": password},
        )
        return response
    return _create_user


@pytest.fixture(scope="function")
async def auth_headers(create_user):
    response = await create_user("testuser", "test@example.com", "12Ukrain34!")
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="function")
async def admin_headers(test_session):
    from backend.app.models.user import User
    from backend.app.core.security import get_password_hash

    admin = User(
        username="admin",
        email="admin@example.com",
        hashed_password=get_password_hash("12Ukrain34!"),
        is_admin=True
    )
    test_session.add(admin)
    await test_session.commit()
    await test_session.refresh(admin)

    from backend.app.core.security import create_token
    token = create_token(admin.id)
    return {"Authorization": f"Bearer {token}"}
