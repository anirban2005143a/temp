from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.deviation import router as deviation_router
from app.config import settings
from app.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.app_name, version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(deviation_router, prefix="/api/deviation")


@app.get("/health")
def root_health():
    return {"status": "ok", "app": settings.app_name}
