from authx import TokenPayload

from server.core.security import auth


def get_jwt_secret_key():
    key = auth.config.JWT_SECRET_KEY
    if key is None:
        raise ValueError("You have to set up JWT_SECRET_KEY")
    return key


def get_token_payload(token: str, verify: bool = False):
    key = get_jwt_secret_key()
    return TokenPayload.decode(token, key=key, verify=verify)
