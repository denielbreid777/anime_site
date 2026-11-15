import enum
from datetime import datetime
from sqlalchemy import String, Text, DateTime, ForeignKey, Enum, func
from sqlalchemy.orm import Mapped, mapped_column
from database import Base


# Категорії товарів - мерч або фігурки
class ProductCategory(str, enum.Enum):
    merch = "merch"
    figure = "figure"


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)

    price: Mapped[int] = mapped_column(nullable=False)
    #на складіj:
    stock: Mapped[int] = mapped_column(nullable=False, default=0)

    category: Mapped[ProductCategory] = mapped_column(Enum(ProductCategory), nullable=False, index=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # Товар може бти по якомусь анімено а може і ні
    anime_id: Mapped[int | None] = mapped_column(ForeignKey("anime.id", ondelete="SET NULL"), nullable=True, index=True)

    # ховаємо товар якшо немаж в стоцфі
    is_active: Mapped[bool] = mapped_column(nullable=False, default=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
