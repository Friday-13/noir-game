from fastapi import FastAPI
from authx import AuthXConfig, AuthX
from dotenv import load_dotenv
import os

from server.api.auth import auth_router


load_dotenv()
app = FastAPI()

def get_secret_key():
    key = os.getenv("SECRET_KEY")
    if key:
        return key
    raise EnvironmentError("SECRET_KEY environment variable is not set")

config = AuthXConfig(
     JWT_ALGORITHM = "HS256",
     JWT_SECRET_KEY = get_secret_key(),
     JWT_TOKEN_LOCATION = ["cookies"],
)

auth = AuthX(config=config)
auth.handle_errors(app)
app.include_router(auth_router)
