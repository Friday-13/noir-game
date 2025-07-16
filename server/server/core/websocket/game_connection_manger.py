from server.db.session import SessionDep

from .auth_service import AuthException, AuthService
from .connection_manager import ConnectionManager
from .connections import AuthConnection, Connection


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
