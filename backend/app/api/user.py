from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm

from backend.database import get_db
from backend.app.schemas.token import TokenResponse
from backend.app.schemas.user import UserRegistr, UserRespons
from backend.app.crud.user import registration, login
from backend.app.models.user import User
from backend.app.core.dependencies import get_current_user, get_user




router = APIRouter(prefix="/account", tags=["Account"])

@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_400_BAD_REQUEST: {'description': 'User with this email already exist'},
        status.HTTP_422_UNPROCESSABLE_CONTENT: {"description": 'Data validation ERROR'}
    }
)
async def registration_route(user: UserRegistr, db: AsyncSession = Depends(get_db)):
    token = await registration(user, db)
    if not token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    return {"access_token": token}



@router.post("/login",
             response_model=TokenResponse,
             status_code=status.HTTP_200_OK,
             responses={status.HTTP_400_BAD_REQUEST: {'description': "Wrong Login or password"}})

async def login_route(user: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    token = await login(user, db)

    if not token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

    return {"access_token": token}


@router.get("/me",
            response_model=UserRespons,
            status_code=status.HTTP_200_OK,
            responses={status.HTTP_400_BAD_REQUEST: {"description": "Token is not valid"},
                       status.HTTP_401_UNAUTHORIZED: {"description": "Token is required"}})
async def get_user_router(user: User = Depends(get_user)):
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token is not valid")

    return user
