from fastapi import FastAPI
from contextlib import asynccontextmanager
from backend.app.api.user import router as user_router
from backend.app.api.anime import router as anime_router
from backend.app.api.post import router as post_router

from fastapi.middleware.cors import CORSMiddleware



@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting application...")
    yield
    print("Stopping application...")

app = FastAPI(
    title="Anime Wem Site With Messanger in it",
    lifespan=lifespan,
    version="1.0.0",
    description="A simple anime watching application with messenger functionality",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    contact={
        "name": "Daniel Breid",
        "email": "danielshkyndia@gmail.com",
    })


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(user_router)
app.include_router(anime_router)
app.include_router(post_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True, log_level="info")

