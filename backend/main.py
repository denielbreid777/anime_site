from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.api.user import router

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


app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True, log_level="info")

