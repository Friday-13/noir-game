from typing import Generic, TypeVar

from .connections import Connection

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
