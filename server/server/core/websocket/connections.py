from fastapi import WebSocket

from server.db.user_model import UserModel


class Connection:
    def __init__(self, websocket: WebSocket):
        self.websocket = websocket


class AuthConnection(Connection):
    def __init__(self, websocket: WebSocket, user: UserModel):
        super().__init__(websocket)
        self.user = user
