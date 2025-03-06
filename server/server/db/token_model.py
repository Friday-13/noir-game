from datetime import datetime
from typing import Literal, Sequence

from passlib.hash import bcrypt
from sqlalchemy import Boolean, DateTime, ForeignKey, String, select, update
from sqlalchemy.orm import Mapped, mapped_column

from server.db.session import Base, SessionDep
from server.utils.auth_config import get_token_payload

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
        token_payload = get_token_payload(token)
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
    async def get_token(session: SessionDep, token: str) -> TokenModel | None:
        token_payload = get_token_payload(token)
        query = select(TokenModel).where(
            (TokenModel.user_id == token_payload.sub)
            & (TokenModel.issued_at == token_payload.issued_at)
        )
        data = await session.execute(query)
        tokens_id_db = data.scalars().all()
        for token_in_db in tokens_id_db:
            if bcrypt.verify(token, token_in_db.token_hash):
                return token_in_db

    @staticmethod
    async def revoke_tokens(session: SessionDep, tokens: list[str]):
        uids = [get_token_payload(token).sub for token in tokens]

        select_query = select(TokenModel).where(
            (TokenModel.is_revoked.is_(False)) & (TokenModel.user_id.in_(uids))
        )
        select_result = await session.execute(select_query)
        rows: Sequence[TokenModel] = select_result.scalars().all()

        revoked_ids = []
        for row in rows:
            for token in tokens:
                if bcrypt.verify(token, row.token_hash):
                    revoked_ids.append(row.id)
                    break
        update_query = (
            update(TokenModel)
            .where(TokenModel.id.in_(revoked_ids))
            .values(is_revoked=True)
        )

        update_result = await session.execute(update_query)
        await session.commit()
        return update_result.rowcount

    @classmethod
    async def is_active(cls, session: SessionDep, token: str):
        token_in_db = await cls.get_token(session, token)
        if token_in_db is None:
            return False
        return not token_in_db.is_revoked
