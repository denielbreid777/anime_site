from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.product import Product, ProductCategory
from app.schemas.product import ProductCreate, ProductUpdate


async def get_products(db: AsyncSession, category: ProductCategory | None = None, anime_id: int | None = None):
    query = select(Product).where(Product.is_active == True)

    if category is not None:
        query = query.where(Product.category == category)
    if anime_id is not None:
        query = query.where(Product.anime_id == anime_id)

    res_products = (await db.execute(query.order_by(Product.created_at.desc()))).scalars().all()
    return res_products


async def get_product_by_id(product_id: int, db: AsyncSession):
    res_product = (await db.execute(select(Product).where(Product.id == product_id))).scalar_one_or_none()
    return res_product


async def create_product(product: ProductCreate, db: AsyncSession):
    created_product = Product(
        name=product.name,
        description=product.description,
        price=product.price,
        stock=product.stock,
        category=product.category,
        image_url=product.image_url,
        anime_id=product.anime_id,
    )
    db.add(created_product)
    await db.commit()
    await db.refresh(created_product)
    return created_product


async def update_product(product_id: int, product: ProductUpdate, db: AsyncSession):
    finded_product = (await db.execute(select(Product).where(Product.id == product_id))).scalar_one_or_none()

    if not finded_product:
        return None

    if product.name is not None:
        finded_product.name = product.name
    if product.description is not None:
        finded_product.description = product.description
    if product.price is not None:
        finded_product.price = product.price
    if product.stock is not None:
        finded_product.stock = product.stock
    if product.category is not None:
        finded_product.category = product.category
    if product.image_url is not None:
        finded_product.image_url = product.image_url
    if product.anime_id is not None:
        finded_product.anime_id = product.anime_id
    if product.is_active is not None:
        finded_product.is_active = product.is_active

    await db.commit()
    await db.refresh(finded_product)
    return finded_product


# Не видаляємо з бази а ховаємо (is_active = False)
async def del_product_by_id(product_id: int, db: AsyncSession):
    product = (await db.execute(select(Product).where(Product.id == product_id))).scalar_one_or_none()

    if not product:
        return None

    product.is_active = False
    await db.commit()
    await db.refresh(product)
    return product
