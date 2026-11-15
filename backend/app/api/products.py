from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from app.models.user import User
from app.models.product import ProductCategory
from app.core.dependencies import get_admin_user
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.crud.product import get_products, get_product_by_id, create_product, update_product, del_product_by_id
from app.crud.anime import get_anime


router = APIRouter(prefix="/products", tags=["Products"])


# Всі товари (тільки активні) + фільтр по категорії і аніме
@router.get("",
            response_model=list[ProductResponse],
            status_code=status.HTTP_200_OK)
async def get_products_route(category: ProductCategory | None = None, anime_id: int | None = None,
                             db: AsyncSession = Depends(get_db)):
    products = await get_products(db, category, anime_id)
    return products


# Один товар
@router.get("/{product_id}",
            response_model=ProductResponse,
            status_code=status.HTTP_200_OK,
            responses={
                status.HTTP_400_BAD_REQUEST: {"description": "Invalid product ID"},
                status.HTTP_404_NOT_FOUND: {"description": "Product not found"}
            })
async def get_product_route(product_id: int, db: AsyncSession = Depends(get_db)):
    if product_id <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid product ID")

    product = await get_product_by_id(product_id, db)
    if product is None or not product.is_active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


# Створення - тільки адмін
@router.post("",
             response_model=ProductResponse,
             status_code=status.HTTP_201_CREATED,
             responses={
                 status.HTTP_401_UNAUTHORIZED: {"description": "Token is required"},
                 status.HTTP_403_FORBIDDEN: {"description": "Only admin can create products"},
                 status.HTTP_404_NOT_FOUND: {"description": "Anime not found"},
                 status.HTTP_422_UNPROCESSABLE_CONTENT: {"description": "Data validation error"}
             })
async def create_product_route(product: ProductCreate, db: AsyncSession = Depends(get_db),
                               user: User = Depends(get_admin_user)):
    if product.anime_id is not None and await get_anime(product.anime_id, db) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Anime not found")

    res_product = await create_product(product, db)
    return res_product


# Редагування - тільки адмін
@router.patch("/{product_id}",
              response_model=ProductResponse,
              status_code=status.HTTP_200_OK,
              responses={
                  status.HTTP_400_BAD_REQUEST: {"description": "Invalid product ID"},
                  status.HTTP_401_UNAUTHORIZED: {"description": "Token is required"},
                  status.HTTP_403_FORBIDDEN: {"description": "Only admin can update products"},
                  status.HTTP_404_NOT_FOUND: {"description": "Product or anime not found"},
                  status.HTTP_422_UNPROCESSABLE_CONTENT: {"description": "Data validation error"}
              })
async def update_product_route(product_id: int, product: ProductUpdate, db: AsyncSession = Depends(get_db),
                               user: User = Depends(get_admin_user)):
    if product_id <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid product ID")

    if product.anime_id is not None and await get_anime(product.anime_id, db) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Anime not found")

    res_product = await update_product(product_id, product, db)
    if res_product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return res_product


# Видалення (ховаємо товар) - тільки адмін
@router.delete("/{product_id}",
               response_model=ProductResponse,
               status_code=status.HTTP_200_OK,
               responses={
                   status.HTTP_400_BAD_REQUEST: {"description": "Invalid product ID"},
                   status.HTTP_401_UNAUTHORIZED: {"description": "Token is required"},
                   status.HTTP_403_FORBIDDEN: {"description": "Only admin can delete products"},
                   status.HTTP_404_NOT_FOUND: {"description": "Product not found"}
               })
async def del_product_route(product_id: int, db: AsyncSession = Depends(get_db),
                            user: User = Depends(get_admin_user)):
    if product_id <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid product ID")

    product = await del_product_by_id(product_id, db)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product
