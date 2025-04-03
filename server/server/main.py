from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.api.auth import auth_router
from server.api.game import game_router
from server.core.security import auth

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(game_router)
auth.handle_errors(app)
