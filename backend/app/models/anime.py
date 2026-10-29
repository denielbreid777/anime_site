from typing import TYPE_CHECKING
from backend.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, DateTime, func, Text , Enum
from datetime import datetime
import enum

if TYPE_CHECKING:
    from backend.app.models.post import Post


class AnimeStatus(str, enum.Enum):
    announced = "announced"
    ongoing = "ongoing"
    finished = "finished"


class Anime(Base):
    __tablename__ = "anime"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    year: Mapped[int] = mapped_column(nullable=False)
    episodes: Mapped[int | None] = mapped_column(nullable=True)
    status: Mapped[AnimeStatus] = mapped_column(Enum(AnimeStatus), nullable=False, default=AnimeStatus.announced)
    poster_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    posts: Mapped[list["Post"]] = relationship(back_populates="anime")