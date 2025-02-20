from datetime import datetime
from typing import Literal

from authx import TokenPayload
from passlib.hash import bcrypt
from sqlalchemy import Boolean, DateTime, ForeignKey, String, select, update
from sqlalchemy.orm import Mapped, mapped_column

from server.core.security import auth
from server.db.session import Base, SessionDep

type TokenType = Literal["access", "refresh"]


class TokenModel(Base):
    __tablename__ = "tokens"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    token_hash: Mapped[str] = mapped_column(String, nullable=False)
    token_type: Mapped[str] = mapped_column(String, nullable=False)
    issued_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now(), nullable=False
    )
    expire_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    is_revoked: Mapped[bool] = mapped_column(Boolean, default=False)


class TokenRepository:
    @staticmethod
    def _add_token_to_session(
        session: SessionDep, token: str, is_revoked: bool = False
    ):
        key = auth.config.JWT_SECRET_KEY
        if key is None:
            raise ValueError("You have to set up JWT_SECRET_KEY")
        token_payload = TokenPayload.decode(token, key=key, verify=False)

        new_token = TokenModel(
            user_id=token_payload.sub,
            token_hash=bcrypt.hash(token),
            token_type=token_payload.type,
            issued_at=token_payload.issued_at,
            expire_at=token_payload.expiry_datetime,
            is_revoked=is_revoked,
        )
        session.add(new_token)
        return new_token

    @classmethod
    async def add_token_pair(
        cls, session: SessionDep, access_token: str, refresh_token: str
    ):
        new_access_token = cls._add_token_to_session(session, access_token)
        new_refresh_token = cls._add_token_to_session(session, refresh_token)
        await session.flush()
        await session.commit()
        return new_access_token, new_refresh_token

    @classmethod
    async def add_token(cls, session: SessionDep, token: str, is_revoked: bool = False):
        new_token = cls._add_token_to_session(session, token, is_revoked)
        await session.flush()
        await session.commit()
        return new_token

    @staticmethod
    async def get_token(session: SessionDep, token: str):
        token_hash = bcrypt.encrypt(token)
        query = select(TokenModel).where(TokenModel.token_hash == token_hash)
        data = await session.execute(query)
        token_id_db = data.scalar_one_or_none()
        return token_id_db

    @staticmethod
    async def revoke_tokens(session: SessionDep, tokens: list[str]):
        token_hashes = [bcrypt.encrypt(token) for token in tokens]
        query = (
            update(TokenModel)
            .where(TokenModel.token_hash.in_(token_hashes))
            .values(is_revoked=True)
        )
        result = await session.execute(query)
        await session.commit()
        return result.rowcount

    @classmethod
    async def is_active(cls, session: SessionDep, token: str):
        token_in_db = await cls.get_token(session, token)
        if token_in_db is None:
            return False
        return not token_in_db.is_revoked
