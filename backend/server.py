from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from lib.config import settings
from api.routes.process_query import process_query_router

app = FastAPI(title=settings.app_name, version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(process_query_router, prefix="/api")

@app.get("/health")
def root_health():
    return {"status": "ok", "app": settings.app_name}
