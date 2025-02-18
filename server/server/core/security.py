import os
from datetime import timedelta

from authx import AuthXConfig
from dotenv import load_dotenv
from fastapi.security import APIKeyCookie, APIKeyHeader

from server.core.authx_with_payloads import AuthXWithPayloads

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
    JWT_REFRESH_TOKEN_EXPIRES=timedelta(days=20),
)


auth = AuthXWithPayloads(config=config)
access_header_scheme = APIKeyHeader(name=config.JWT_ACCESS_CSRF_HEADER_NAME)
refresh_header_scheme = APIKeyHeader(name=config.JWT_REFRESH_CSRF_HEADER_NAME)
refresh_cookie_scheme = APIKeyCookie(name=config.JWT_REFRESH_COOKIE_NAME)
