from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from server.core.websocket.auth_service import AuthService
from server.core.websocket.connections import Connection
from server.core.websocket.game_connection_manger import GameConnectionManager
from server.db.session import SessionDep

game_router = APIRouter(prefix="/games", tags=["game"])

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
