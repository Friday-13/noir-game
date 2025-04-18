import asyncio
import json
from typing import Generic, TypeVar

import pydantic
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import BaseModel

from server.db.session import SessionDep
from server.db.token_model import TokenRepository
from server.db.user_model import UserModel, UserRepository
from server.utils.auth_config import get_token_payload

game_router = APIRouter(prefix="/games", tags=["game"])


class BaseMessage(BaseModel):
    type: str


class AuthMessage(BaseMessage):
    token: str


class AuthException(Exception):
    pass


class Connection:
    def __init__(self, websocket: WebSocket):
        self.websocket = websocket


class AuthConnection(Connection):
    def __init__(self, websocket: WebSocket, user: UserModel):
        super().__init__(websocket)
        self.user = user


T = TypeVar("T", bound=Connection)


class ConnectionManager(Generic[T]):
    def __init__(self):
        self.active_clients: list[T] = []

    async def connect(self, client: T):
        await client.websocket.accept()
        self.active_clients.append(client)

    async def disconnect(self, client: T, code: int = 1000):
        await client.websocket.close(code)
        self.active_clients.remove(client)

    async def send_personal_message(self, message: str, client: T):
        await client.websocket.send_text(message)

    async def broadcast(self, message: str, from_client: T):
        for client in self.active_clients:
            if client != from_client:
                await client.websocket.send_text(message)

    async def broadcast_to_all(self, message: str):
        for client in self.active_clients:
            await client.websocket.send_text(message)


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


class GameConnectionManager(ConnectionManager):
    def __init__(self, authentication_service: AuthService):
        super().__init__()
        self.active_clients: list[AuthConnection] = []
        self.auth_service = authentication_service

    async def authorize_connection(
        self, unauth_connection: Connection, session: SessionDep
    ):
        try:
            token = await self.auth_service.handshake(unauth_connection)
            user = await self.auth_service.get_user_by_token(session, token)
            auth_connection = self.auth_service.authenticate(unauth_connection, user)
            await self.connect(auth_connection)
            return auth_connection
        except AuthException as e:
            await self.send_personal_message(str(e), unauth_connection)
            if unauth_connection in self.active_clients:
                await self.disconnect(unauth_connection)
            else:
                await unauth_connection.websocket.close()
            return None


auth_service = AuthService()
manager = GameConnectionManager(auth_service)


@game_router.websocket("/ws")
async def game(session: SessionDep, websocket: WebSocket):
    unauth_client = Connection(websocket)
    client = await manager.authorize_connection(unauth_client, session)
    if not client:
        return

    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_personal_message(f"You wrote: {data}", client)
            await manager.broadcast(f"Client says: {data}", client)
    except WebSocketDisconnect:
        await manager.disconnect(client)
        await manager.broadcast("Client left the chat", client)


@game_router.post("/create")
async def create_game():
    pass


@game_router.get("/list")
async def list_game():
    pass
