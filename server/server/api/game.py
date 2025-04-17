import asyncio
import json
from typing import Optional

import pydantic
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import BaseModel

from server.db.session import SessionDep
from server.db.token_model import TokenRepository
from server.db.user_model import UserModel, UserRepository
from server.utils.auth_config import get_token_payload

game_router = APIRouter(prefix="/games", tags=["game"])


class Connection:
    def __init__(self, websocket: WebSocket, user: Optional[UserModel] = None):
        self.websocket = websocket
        self.user = user

    def set_user(self, user: Optional[UserModel]):
        self.user = user


class ConnectionManager:
    def __init__(self):
        self.active_clients: list[Connection] = []

    async def connect(self, client: Connection):
        await client.websocket.accept()
        self.active_clients.append(client)

    async def disconnect(self, client: Connection, code: int = 1000):
        await client.websocket.close(code)
        self.active_clients.remove(client)

    async def send_personal_message(self, message: str, client: Connection):
        await client.websocket.send_text(message)

    async def broadcast(self, message: str, from_client: Connection):
        for client in self.active_clients:
            if client != from_client:
                await client.websocket.send_text(message)

    async def broadcast_to_all(self, message: str):
        for client in self.active_clients:
            await client.websocket.send_text(message)


class GameConnectionManager(ConnectionManager):
    async def wait_for_introducing(self, client: Connection, timeout: float = 30.0):
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

    async def verify_user_by_token(self, session: SessionDep, token: str):
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


manager = GameConnectionManager()


class BaseMessage(BaseModel):
    type: str


class AuthMessage(BaseMessage):
    token: str


@game_router.post("/create")
async def create_game():
    pass


@game_router.get("/list")
async def list_game():
    pass


class AuthException(Exception):
    pass


@game_router.websocket("/ws")
async def game(session: SessionDep, websocket: WebSocket):
    client = Connection(websocket)
    await manager.connect(client)
    try:
        token = await manager.wait_for_introducing(client)
        user = await manager.verify_user_by_token(session, token)
        client.set_user(user)
        if client.user:
            await manager.broadcast_to_all(f"User {client.user.name} added to session")
    except AuthException as e:
        await manager.send_personal_message(str(e), client)
        await manager.disconnect(client)
        return None

    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_personal_message(f"You wrote: {data}", client)
            await manager.broadcast(f"Client says: {data}", client)
    except WebSocketDisconnect:
        await manager.disconnect(client)
        await manager.broadcast("Client left the chat", client)
