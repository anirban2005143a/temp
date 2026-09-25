from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "AI Deviation Intake Module"
    database_url: str = "sqlite:///./deviation.db"
    huggingface_api_token: str = ""
    model_name: str = "meta-llama/Meta-Llama-3.1-8B-Instruct"

    class Config:
        env_file = ".env"


settings = Settings()
