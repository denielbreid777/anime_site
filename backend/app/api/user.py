from fastapi import APIRouter
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
import schemas
from crud.user import registration, login
from models.user import User
from app.core.dependencies import get_current_user
from fastapi.security import OAuth2PasswordRequestForm




router = APIRouter(prefix="/account", tags=["Account"])

@router.post(
    "/register",
    response_model=schemas.token.TokenResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_400_BAD_REQUEST: {'description': 'User with this email already exist'},
        status.HTTP_422_UNPROCESSABLE_CONTENT: {"description": 'Data validation ERROR'}
    }
)
async def registration_route(user: schemas.user.UserRegister, db: AsyncSession = Depends(get_db)):
    token = await registration(user, db)
    if not token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    return {"access_token": token}



@router.post("/login", 
             response_model=schemas.token.TokenResponse, 
             status_code=status.HTTP_200_OK, 
             responses={status.HTTP_400_BAD_REQUEST: {'description': "Wrong Login or password"}})

async def login_route(user: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    token = await login(user, db)

    if not token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

    return {"access_token": token}


@router.get("/me", 
            response_model=schemas.user.UserRespons, 
            status_code=status.HTTP_200_OK,
            responses={status.HTTP_400_BAD_REQUEST: {"description": "Token is not valid"},
                       status.HTTP_401_UNAUTHORIZED: {"description": "Token is required"}})
async def get_user_router(user: User = Depends(get_user)):
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token is not valid")    

    return user
