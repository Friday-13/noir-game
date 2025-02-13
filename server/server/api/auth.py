from typing import Annotated

from authx import RequestToken, TokenPayload
from fastapi import APIRouter, Body, Depends, Response

from server.core.security import access_header_scheme, auth, refresh_header_scheme
from server.db.models import UserRepository
from server.db.session import SessionDep
from server.schemas.auth import UserLoginScheme, UserRegisterScheme
from server.utils.api import (
    set_user_auth,
    update_user_auth,
    validate_password,
    validate_user_existance,
    validate_user_uniqueness,
)

auth_router = APIRouter(prefix="", tags=["auth"])


@auth_router.post("/register")
async def register(
    user: Annotated[UserRegisterScheme, Body(embed=False)],
    session: SessionDep,
    response: Response,
):
    user_in_db = await UserRepository.get_user(
        session, name=user.name, email=user.email
    )
    validate_user_uniqueness(user, user_in_db)
    new_user = await UserRepository.create_user(
        session, name=user.name, email=user.email, password=user.password
    )
    token, refresh_token = set_user_auth(response, new_user.id)
    return {"access_token": token, "refresh_token": refresh_token}


@auth_router.post("/login")
async def login(
    user: Annotated[UserLoginScheme, Body(embed=False)],
    session: SessionDep,
    response: Response,
):
    user_in_db = await UserRepository.get_user(
        session, email_or_name=user.email_or_name
    )
    user_in_db = validate_user_existance(user_in_db)
    validate_password(user.password, user_in_db.pass_hash)
    token, refresh_token = set_user_auth(response, user_in_db.id)
    return {"access_token": token, "refresh_token": refresh_token}


@auth_router.get(
    "/protected",
    dependencies=[Depends(auth.access_token_required), Depends(access_header_scheme)],
)
def protected():
    print("access granted")
    return {"access": True}


@auth_router.get(
    "/is-auth",
    dependencies=[Depends(auth.access_token_required), Depends(access_header_scheme)],
)
def check_auth():
    return {"isAuth": True}


@auth_router.post(
    "/refresh",
    dependencies=[
        Depends(auth.refresh_token_required),
        Depends(refresh_header_scheme),
    ],
)
def refresh(
    response: Response,
    refresh_payload: TokenPayload = Depends(auth.refresh_token_required),
    refresh_token_request: RequestToken = Depends(auth.get_refresh_token_from_request),
):
    token, refresh_token = update_user_auth(
        response, refresh_payload, refresh_token_request
    )
    return {"access_token": token, "refresh_token": refresh_token}
