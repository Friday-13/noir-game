from fastapi import FastAPI

from server.api.auth import auth_router
from server.api.game import game_router
from server.core.security import auth

app = FastAPI()
app.include_router(auth_router)
app.include_router(game_router)
auth.handle_errors(app)
