from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

from app.models.product import ProductCategory


class ProductCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200, examples=["Фігурка Мікаси"])
    description: str = Field(min_length=1, examples=["Фігурка 20 см з підставкою"])
    price: int = Field(ge=1, description="Ціна в центах (1999 = 19.99)", examples=[1999])
    stock: int = Field(default=0, ge=0, description="Скільки штук на складі", examples=[10])
    category: ProductCategory = Field(description="merch / figure")
    image_url: str | None = Field(default=None, max_length=500)
    anime_id: int | None = Field(default=None, examples=[1])


# Лиш адмін може, всі поля не обов'язкові
class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, min_length=1)
    price: int | None = Field(default=None, ge=1)
    stock: int | None = Field(default=None, ge=0)
    category: ProductCategory | None = None
    image_url: str | None = Field(default=None, max_length=500)
    anime_id: int | None = None
    is_active: bool | None = None


class ProductResponse(BaseModel):
    id: int
    name: str
    description: str
    price: int
    stock: int
    category: ProductCategory
    image_url: str | None
    anime_id: int | None
    is_active: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
