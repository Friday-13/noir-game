from typing import Annotated

from authx import TokenPayload
from fastapi import APIRouter, Body, Depends, HTTPException, Response

from server.core.security import access_header_scheme, auth, refresh_header_scheme
from server.db.session import SessionDep
from server.db.token_model import TokenRepository
from server.db.user_model import UserRepository
from server.schemas.auth import AuthResponseScheme, UserLoginScheme, UserRegisterScheme
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
) -> AuthResponseScheme:
    user_in_db = await UserRepository.get_user(
        session, name=user.name, email=user.email
    )
    validate_user_uniqueness(user, user_in_db)
    new_user = await UserRepository.create_user(
        session, name=user.name, email=user.email, password=user.password
    )
    token, refresh_token = set_user_auth(response, new_user.id)
    await TokenRepository.add_token_pair(session, token, refresh_token)
    credentials = AuthResponseScheme(
        name=new_user.name, auth_token=token, refresh_token=refresh_token
    )
    return credentials


@auth_router.post("/login")
async def login(
    user: Annotated[UserLoginScheme, Body(embed=False)],
    session: SessionDep,
    response: Response,
) -> AuthResponseScheme:
    user_in_db = await UserRepository.get_user(
        session, email_or_name=user.email_or_name
    )
    user_in_db = validate_user_existance(user_in_db)
    validate_password(user.password, user_in_db.pass_hash)
    token, refresh_token = set_user_auth(response, user_in_db.id)
    await TokenRepository.add_token_pair(session, token, refresh_token)
    credentials = AuthResponseScheme(
        name=user_in_db.name, auth_token=token, refresh_token=refresh_token
    )
    return credentials


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
async def refresh(
    response: Response,
    session: SessionDep,
    refresh_payload: TokenPayload = Depends(auth.refresh_token_required),
    refresh_token_request=auth.REFRESH_TOKEN,
) -> AuthResponseScheme:

    is_active = TokenRepository.is_active(session, refresh_token_request.token)
    if not is_active:
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token",
        )

    token, refresh_token = update_user_auth(
        response, refresh_payload, refresh_token_request
    )
    user = await UserRepository.get_user(session, uid=refresh_payload.sub)
    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token or user not found",
        )
    if refresh_token != refresh_token_request.token:
        await TokenRepository.add_token_pair(session, token, refresh_token)
    else:
        await TokenRepository.add_token(session, token)

    credentials = AuthResponseScheme(
        name=user.name, auth_token=token, refresh_token=refresh_token
    )
    return credentials


# @auth_router.post(
#     "/logout",
#     dependencies=[
#         Depends(auth.refresh_token_required),
#         Depends(auth.access_token_required),
#         Depends(refresh_header_scheme),
#         Depends(access_header_scheme),
#     ],
# )
# async def logout(
#     response: Response,
#     session: SessionDep,
#     refresh_token_request=auth.REFRESH_TOKEN,
#     access_token_request=auth.ACCESS_TOKEN,
# ):
#     await TokenRepository.revoke_tokens(
#         session, [refresh_token_request.token, access_token_request.token]
#     )
#     auth.unset_cookies(response)
#     return "OK"
