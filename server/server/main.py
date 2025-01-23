from fastapi import FastAPI

from server.api.auth import auth_router
from server.core.security import auth

app = FastAPI()
app.include_router(auth_router)
auth.handle_errors(app)
