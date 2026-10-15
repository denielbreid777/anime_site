from sqlalchemy import MetaData
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine, AsyncSession
from typing import AsyncGenerator


DATABASE_URL = "mysql+aiomysql://root:@localhost:3306/anime_db"

convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}



class Base(DeclarativeBase):
    metadata = MetaData(naming_convention=convention)


engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

Async_Session_Local = async_sessionmaker(
    binding=engine,
    autocommit = False,
    autoflush = False,
    expire_on_commit = False,
    class_ = AsyncSession
)


async def get_db()->AsyncGenerator[AsyncSession, None]:
    async with Async_Session_Local() as session:
        yield session