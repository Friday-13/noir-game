import asyncio
import json

import pydantic

from server.db.session import SessionDep
from server.db.token_model import TokenRepository
from server.db.user_model import UserModel, UserRepository
from server.schemas.game import AuthMessage
from server.utils.auth_config import get_token_payload

from .connections import AuthConnection, Connection


class AuthException(Exception):
    pass


class AuthService:
    async def handshake(self, client: Connection, timeout: float = 30.0):
        try:
            welcome_message = await asyncio.wait_for(
                client.websocket.receive_text(), timeout=timeout
            )
            auth_data = AuthMessage(**json.loads(welcome_message))
            token = auth_data.token
            return token
        except asyncio.TimeoutError as e:
            message = f"Timeout error {e}"
            raise AuthException(message) from e
        except json.JSONDecodeError as e:
            message = f"Wrong json: {e}"
            raise AuthException(message) from e
        except pydantic.ValidationError as e:
            message = f"Validation error {e}"
            raise AuthException(message) from e

    async def get_user_by_token(self, session: SessionDep, token: str):
        token_is_active = await TokenRepository.is_active(session, token)
        if not token_is_active:
            message = "Token is inactive"
            raise AuthException(message)
        token_payload = get_token_payload(token)
        user_id = token_payload.sub
        user = await UserRepository.get_user(session, user_id)
        if not user:
            message = "User doesn't exist"
            raise AuthException(message)
        return user

    def authenticate(self, conn: Connection, user: UserModel) -> AuthConnection:
        return AuthConnection(conn.websocket, user)
