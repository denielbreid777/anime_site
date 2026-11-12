from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm

from database import get_db
from app.schemas.token import TokenResponse
from app.schemas.user import UserRegistr, UserRespons
from app.crud.user import registration, login
from app.models.user import User
from app.core.dependencies import get_current_user, get_user




router = APIRouter(prefix="/account", tags=["Account"])

@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_400_BAD_REQUEST: {'description': 'User with this email already exist'},
        status.HTTP_422_UNPROCESSABLE_CONTENT: {"description": 'Data validation error'},
        status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Database error"}
    }
)
async def registration_route(user: UserRegistr, db: AsyncSession = Depends(get_db)):
    try:
        token = await registration(user, db)
        if not token:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User with this username or email already exists")
        return {"access_token": token}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error")



@router.post("/login",
             response_model=TokenResponse,
             status_code=status.HTTP_200_OK,
             responses={
                 status.HTTP_400_BAD_REQUEST: {'description': "Wrong login or password"},
                 status.HTTP_422_UNPROCESSABLE_CONTENT: {"description": "Validation error"},
                 status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Database error"}
             })

async def login_route(user: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    try:
        token = await login(user, db)

        if not token:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Wrong login or password")

        return {"access_token": token}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error")


@router.get("/me",
            response_model=UserRespons,
            status_code=status.HTTP_200_OK,
            responses={
                status.HTTP_401_UNAUTHORIZED: {"description": "Token is invalid or required"},
                status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Database error"}
            })
async def get_user_router(user: User = Depends(get_current_user)):
    try:
        return user
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error")
