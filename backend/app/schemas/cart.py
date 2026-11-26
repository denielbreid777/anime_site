from pydantic import BaseModel, Field, ConfigDict


class CartItemCreate(BaseModel):
    product_id: int = Field(description="ID товару")
    quantity: int = Field(default=1, ge=1, description="Кількість")


class CartItemUpdate(BaseModel):
    quantity: int = Field(ge=1, description="Нова кількість")


class CartItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    model_config = ConfigDict(from_attributes=True)


class CartItemWithProduct(CartItemResponse):
    product_name: str
    product_price: int
    product_image_url: str | None
    product_stock: int


class CartResponse(BaseModel):
    items: list[CartItemWithProduct]
    total_quantity: int
    total_price: int
