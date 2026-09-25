from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    app_name: str = os.getenv('APP_NAME', "AI Deviation Intake Module") 
    huggingface_api_token: str = os.getenv('HUGGINGFACEHUB_API_TOKEN')
    model_name: str = os.getenv('MODEL_NAME', "meta-llama/Meta-Llama-3.1-8B-Instruct")
    model_invoke_delay_sec:int = os.getenv('MODEL_INVOKE_DELAY_SEC', 20)

settings = Settings()