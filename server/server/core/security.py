import os

from authx import AuthX, AuthXConfig
from dotenv import load_dotenv
from fastapi.security import APIKeyHeader

load_dotenv()


def get_secret_key():
    key = os.getenv("SECRET_KEY")
    if key:
        return key
    raise EnvironmentError("SECRET_KEY environment variable is not set")


config = AuthXConfig(
    JWT_ALGORITHM="HS256",
    JWT_SECRET_KEY=get_secret_key(),
    JWT_TOKEN_LOCATION=["cookies"],
)

auth = AuthX(config=config)
header_scheme = APIKeyHeader(name=config.JWT_ACCESS_CSRF_HEADER_NAME)
