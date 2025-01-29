from typing import Annotated

from fastapi import APIRouter, Header, WebSocket, WebSocketDisconnect

game_router = APIRouter(prefix="/games", tags=["game"])


class Connection:
    def __init__(self, client_id: str, websocket: WebSocket):
        self.id = client_id
        self.websocket = websocket


class ConnectionManager:
    def __init__(self):
        self.active_clients: list[Connection] = []

    async def connect(self, client: Connection):
        await client.websocket.accept()
        self.active_clients.append(client)

    def disconnect(self, client: Connection):
        self.active_clients.remove(client)

    async def send_personal_message(self, message: str, client: Connection):
        await client.websocket.send_text(message)

    async def broadcast(self, message: str, from_client: Connection):
        for client in self.active_clients:
            if client != from_client:
                await client.websocket.send_text(message)


manager = ConnectionManager()


@game_router.post("/create")
async def create_game():
    pass


@game_router.get("/list")
async def list_game():
    pass


@game_router.websocket("/ws")
async def game(websocket: WebSocket, client_id: Annotated[int, Header()]):
    client = Connection(str(client_id), websocket)
    await manager.connect(client)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_personal_message(f"You wrote: {data}", client)
            await manager.broadcast(f"Client #{client_id} says: {data}", client)
    except WebSocketDisconnect:
        manager.disconnect(client)
        await manager.broadcast(f"Client #{client_id} left the chat", client)
