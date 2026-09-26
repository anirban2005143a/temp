import os

from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()


class Settings(BaseSettings):
    app_name: str = os.getenv("APP_NAME", "AI Deviation Intake Module")

    # Hugging Face (kept for reference / rollback)
    huggingface_api_token: str | None = os.getenv("HUGGINGFACEHUB_API_TOKEN")
    huggingface_model_name: str = os.getenv(
        "HUGGINGFACE_MODEL_NAME",
        os.getenv("MODEL_NAME", "meta-llama/Llama-3.1-8B-Instruct"),
    )

    groq_api_key: str | None = os.getenv("GROQ_API_KEY")
    groq_model_name: str = os.getenv(
        "GROQ_MODEL_NAME",
        os.getenv("MODEL_NAME", "llama-3.3-70b-versatile"),
    )

    model_name: str = os.getenv(
        "MODEL_NAME",
        groq_model_name,
    )

    model_invoke_delay_sec: int = int(
        os.getenv("MODEL_INVOKE_DELAY_SEC", "20")
    )

    postgres_host: str = os.getenv("POSTGRES_HOST", "localhost")
    postgres_port: int = int(os.getenv("POSTGRES_PORT", "5432"))
    postgres_user: str = os.getenv("POSTGRES_USER", "postgres")
    postgres_password: str = os.getenv("POSTGRES_PASSWORD", "postgres")
    postgres_db: str = os.getenv("POSTGRES_DB", "pharma_dev")


settings = Settings()
