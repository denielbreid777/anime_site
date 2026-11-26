from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.cart import CartItem
from app.models.product import Product
from app.schemas.cart import CartItemCreate, CartItemUpdate


async def get_user_cart(user_id: int, db: AsyncSession):
    query = (
        select(CartItem)
        .options(selectinload(CartItem.product))
        .where(CartItem.user_id == user_id)
    )
    cart_items = (await db.execute(query)).scalars().all()
    return cart_items


async def add_to_cart(user_id: int, item: CartItemCreate, db: AsyncSession):
    # Перевірити чи товар існує та є в наявності
    product = (await db.execute(select(Product).where(Product.id == item.product_id))).scalar_one_or_none()
    if not product or not product.is_active:
        return None, "Product not found or inactive"
    
    if product.stock < item.quantity:
        return None, "Not enough stock"

    # Перевірити чи товар вже в кошику
    existing = (await db.execute(
        select(CartItem).where(
            CartItem.user_id == user_id,
            CartItem.product_id == item.product_id
        )
    )).scalar_one_or_none()

    if existing:
        # Оновити кількість
        if existing.quantity + item.quantity > product.stock:
            return None, "Not enough stock"
        existing.quantity += item.quantity
        await db.commit()
        await db.refresh(existing)
        return existing, None
    else:
        # Створити новий запис
        cart_item = CartItem(
            user_id=user_id,
            product_id=item.product_id,
            quantity=item.quantity
        )
        db.add(cart_item)
        await db.commit()
        await db.refresh(cart_item)
        return cart_item, None


async def update_cart_item(item_id: int, user_id: int, item: CartItemUpdate, db: AsyncSession):
    cart_item = (await db.execute(
        select(CartItem)
        .options(selectinload(CartItem.product))
        .where(CartItem.id == item_id, CartItem.user_id == user_id)
    )).scalar_one_or_none()

    if not cart_item:
        return None, "Cart item not found"

    # Перевірити stock
    if item.quantity > cart_item.product.stock:
        return None, "Not enough stock"

    cart_item.quantity = item.quantity
    await db.commit()
    await db.refresh(cart_item)
    return cart_item, None


async def delete_cart_item(item_id: int, user_id: int, db: AsyncSession):
    cart_item = (await db.execute(
        select(CartItem).where(CartItem.id == item_id, CartItem.user_id == user_id)
    )).scalar_one_or_none()

    if not cart_item:
        return None

    await db.delete(cart_item)
    await db.commit()
    return cart_item
