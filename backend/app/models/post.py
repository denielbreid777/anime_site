import enum
from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import String, Text, DateTime, ForeignKey, Enum, CheckConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.database import Base

if TYPE_CHECKING:
    from backend.app.models.user import User
    from backend.app.models.anime import Anime

#Це так будуться випадаючий список
class PostType(str, enum.Enum):
    post = "post"
    review = "review"
    fanart = "fanart"


class Post(Base):
    __tablename__ = "posts"
    __table_args__ = (
        CheckConstraint("rating IS NULL OR (rating >= 1 AND rating <= 10)", name="ck_post_rating_range"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    type: Mapped[PostType] = mapped_column(Enum(PostType), nullable=False, default=PostType.post, index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)

    author_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    anime_id: Mapped[int | None] = mapped_column(ForeignKey("anime.id", ondelete="SET NULL"), nullable=True, index=True)

    rating: Mapped[int | None] = mapped_column(nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    author: Mapped["User"] = relationship(back_populates="posts")
    anime: Mapped["Anime"] = relationship(back_populates="posts")