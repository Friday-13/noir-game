from typing import Optional

from passlib.hash import bcrypt
from sqlalchemy import ColumnElement, select
from sqlalchemy.orm import Mapped, mapped_column

from server.db.session import Base, SessionDep


class UserModel(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    email: Mapped[str]
    pass_hash: Mapped[str]


class UserRepository:
    @staticmethod
    async def get_user(
        session: SessionDep,
        uid: Optional[str] = None,
        email_or_name: Optional[str] = None,
        name: Optional[str] = None,
        email: Optional[str] = None,
    ) -> UserModel | None:
        filter_condition: ColumnElement
        if uid:
            filter_condition = UserModel.id == uid
        elif name and email:
            filter_condition = (UserModel.name == name) | (UserModel.email == email)
        elif name:
            filter_condition = UserModel.name == name
        elif email:
            filter_condition = UserModel.email == email
        elif email_or_name:
            filter_condition = (UserModel.email == email_or_name) | (
                UserModel.name == email_or_name
            )
        else:
            raise ValueError(
                "At least one of 'id', 'name', 'email', or 'email_or_name' must be provided"
            )
        query = select(UserModel).where(filter_condition)
        data = await session.execute(query)
        user_in_db = data.scalars().first()
        return user_in_db

    @staticmethod
    async def create_user(session: SessionDep, name: str, email: str, password: str):
        pass_hash = bcrypt.hash(password)
        new_user = UserModel(name=name, email=email, pass_hash=pass_hash)
        session.add(new_user)
        await session.flush()
        await session.commit()
        return new_user
