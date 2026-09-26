from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes.deviation_routes import router as deviation_router
from api.routes.process_query import process_query_router
from database import create_db_and_tables
from lib.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(title=settings.app_name, version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(process_query_router, prefix="/api")
app.include_router(deviation_router, prefix="/api/deviation")


@app.get("/health")
def root_health():
    return {"status": "ok", "app": settings.app_name}
