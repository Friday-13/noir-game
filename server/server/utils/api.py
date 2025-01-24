from fastapi import HTTPException
from passlib.hash import bcrypt

from server.core.security import auth
from server.db.models import UserModel
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


def set_user_auth(response, uid):
    token = auth.create_access_token(uid=str(uid))
    auth.set_access_cookies(response=response, token=token)
    return token
