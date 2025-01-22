from typing import Annotated
from fastapi import APIRouter, Body

from server.schemas.auth import UserLoginScheme, UserRegisterScheme

auth_router = APIRouter(prefix='', tags=['auth'])

@auth_router.post("/register")
def register(user: Annotated[UserRegisterScheme, Body(embed=False)]):
    print(user.username)
    print(user.email)
    return {'access_token': user.username}

@auth_router.post("/login")
def login(user: Annotated[UserLoginScheme, Body(embed=True)]):
    print(user.email_or_username)
    print(user.password)
    return {'access_token': user.email_or_username}

