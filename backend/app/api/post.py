
from fastapi import APIRouter, Depends
from backend.app.dependencies import get_current_user
from backend.app.database import get_db
from backend.app import crud
from backend.app.schemas.post import PostCreate, ReviewCreate, FanartCreate, PostResponse
from backend.app.models.post import PostType

router = APIRouter(prefix="/api", tags=["posts"])



@router.post("/posts", response_model=PostResponse, status_code=201)
async def create_post(data: PostCreate, user=Depends(get_current_user), db=Depends(get_db)):
    return await crud.create_post(db, data, user.id, PostType.post)


@router.post("/reviews", response_model=PostResponse, status_code=201)
async def create_review(data: ReviewCreate, user=Depends(get_current_user), db=Depends(get_db)):
    return await crud.create_post(db, data, user.id, PostType.review)


@router.post("/fanart", response_model=PostResponse, status_code=201)
async def create_fanart(data: FanartCreate, user=Depends(get_current_user), db=Depends(get_db)):
    return await crud.create_post(db, data, user.id, PostType.fanart)