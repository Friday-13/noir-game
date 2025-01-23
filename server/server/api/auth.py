from typing import Annotated

from fastapi import APIRouter, Body, HTTPException, Response
from sqlalchemy import select

from server.core.security import auth
from server.db.models import UserModel
from server.db.session import SessionDep
from server.schemas.auth import UserLoginScheme, UserRegisterScheme

auth_router = APIRouter(prefix="", tags=["auth"])


@auth_router.post("/register")
async def register(
    user: Annotated[UserRegisterScheme, Body(embed=False)],
    session: SessionDep,
    response: Response,
):
    query = select(UserModel).where(
        (UserModel.name == user.name) | (UserModel.email == user.email)
    )
    user_in_db = await session.execute(query)
    existed_user = user_in_db.scalar_one_or_none()
    if existed_user:
        if existed_user.email == user.email:
            raise HTTPException(401, {"message": "User with this email exists"})
        if existed_user.name == user.name:
            raise HTTPException(401, {"message": "User with this username exists"})
    # TODO: add password hashing
    new_user = UserModel(name=user.name, email=user.email, pass_hash=user.password)
    session.add(new_user)
    await session.flush()
    token = auth.create_access_token(uid=str(new_user.id))
    auth.set_access_cookies(response=response, token=token)
    await session.commit()
    return {"access_token": token}


@auth_router.post("/login")
async def login(
    user: Annotated[UserLoginScheme, Body(embed=True)],
    session: SessionDep,
    response: Response,
):
    query = select(UserModel).where(
        (UserModel.email == user.email_or_name) | (UserModel.name == user.email_or_name)
    )
    data = await session.execute(query)
    user_in_db = data.scalar_one_or_none()
    if not user_in_db:
        raise HTTPException(
            401, detail={"message": "User with the provided username does not exist."}
        )
    # TODO: add passwod hashing
    if user_in_db.pass_hash != user.password:
        raise HTTPException(401, detail={"message": "Invalid credentials"})

    token = auth.create_access_token(uid=str(user_in_db.id))
    auth.set_access_cookies(response=response, token=token)
    return {"access_token": token}
