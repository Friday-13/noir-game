from datetime import timedelta

from authx import RequestToken, TokenPayload
from fastapi import HTTPException, Response
from passlib.hash import bcrypt

from server.core.security import auth, config
from server.db.user_model import UserModel
from server.schemas.auth import UserRegisterScheme


def validate_user_uniqueness(user: UserRegisterScheme, user_in_db: UserModel | None):
    if user_in_db:
        if user_in_db.email == user.email:
            raise HTTPException(401, {"message": "User with this email exists"})
        if user_in_db.name == user.name:
            raise HTTPException(401, {"message": "User with this username exists"})


def validate_user_existance(user: UserModel | None):
    if not user:
        raise HTTPException(
            401,
            detail={
                "message": "User with the provided username or email does not exist."
            },
        )
    return user


def validate_password(password, pass_hash):
    if not bcrypt.verify(password, pass_hash):
        raise HTTPException(401, detail={"message": "Invalid credentials"})


def set_access_token(response: Response, uid):
    token = auth.create_access_token(uid=str(uid))
    auth.set_access_cookies(response=response, token=token)
    return token


def set_refresh_token(response: Response, uid):
    max_age = 0
    if isinstance(config.JWT_REFRESH_TOKEN_EXPIRES, timedelta):
        max_age = int(config.JWT_REFRESH_TOKEN_EXPIRES.total_seconds())
    refresh_token = auth.create_refresh_token(uid=str(uid))
    auth.set_refresh_cookies(refresh_token, response, max_age)
    return refresh_token


def set_user_auth(response: Response, uid):
    token = set_access_token(response, uid)
    refresh_token = set_refresh_token(response, uid)
    return token, refresh_token


def update_user_auth(
    response: Response,
    refresh_payload: TokenPayload,
    refresh_token_request: RequestToken,
):
    uid = refresh_payload.sub
    if refresh_payload.time_until_expiry > config.JWT_IMPLICIT_REFRESH_DELTATIME:
        token = set_access_token(response, uid)
        return token, refresh_token_request.token
    return set_user_auth(response, uid)
