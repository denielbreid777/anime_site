from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from app.models.user import User
from app.core.dependencies import get_current_user
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartResponse, CartItemWithProduct
from app.crud import cart as crud

router = APIRouter(prefix="/cart", tags=["Cart"])


@router.get("", response_model=CartResponse, status_code=status.HTTP_200_OK)
async def get_cart(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    try:
        cart_items = await crud.get_user_cart(user.id, db)
        
        # Підрахувати загальну кількість і ціну
        items_with_product = []
        total_quantity = 0
        total_price = 0
        
        for item in cart_items:
            if item.product:
                item_with_product = CartItemWithProduct(
                    id=item.id,
                    product_id=item.product_id,
                    quantity=item.quantity,
                    product_name=item.product.name,
                    product_price=item.product.price,
                    product_image_url=item.product.image_url,
                    product_stock=item.product.stock
                )
                items_with_product.append(item_with_product)
                total_quantity += item.quantity
                total_price += item.product.price * item.quantity
        
        return CartResponse(
            items=items_with_product,
            total_quantity=total_quantity,
            total_price=total_price
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error")


@router.post("", response_model=CartItemWithProduct, status_code=status.HTTP_201_CREATED)
async def add_to_cart(item: CartItemCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    try:
        cart_item, error = await crud.add_to_cart(user.id, item, db)
        
        if error:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)
        
        if not cart_item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        
        # Повернути з даними товару
        return CartItemWithProduct(
            id=cart_item.id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            product_name=cart_item.product.name if cart_item.product else "",
            product_price=cart_item.product.price if cart_item.product else 0,
            product_image_url=cart_item.product.image_url if cart_item.product else None,
            product_stock=cart_item.product.stock if cart_item.product else 0
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error")


@router.patch("/{item_id}", response_model=CartItemWithProduct, status_code=status.HTTP_200_OK)
async def update_cart_item(item_id: int, item: CartItemUpdate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    try:
        cart_item, error = await crud.update_cart_item(item_id, user.id, item, db)
        
        if error:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)
        
        if not cart_item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")
        
        return CartItemWithProduct(
            id=cart_item.id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            product_name=cart_item.product.name if cart_item.product else "",
            product_price=cart_item.product.price if cart_item.product else 0,
            product_image_url=cart_item.product.image_url if cart_item.product else None,
            product_stock=cart_item.product.stock if cart_item.product else 0
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error")


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cart_item(item_id: int, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    try:
        cart_item = await crud.delete_cart_item(item_id, user.id, db)
        
        if not cart_item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error")
