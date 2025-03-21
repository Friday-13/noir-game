import base64
import hashlib
import os

SALT_LENGTH = 16
HASH_ITERATIONS = 1000
HASH_NAME = "sha256"


def hash_token(token: str) -> str:
    salt = os.urandom(SALT_LENGTH)
    hashed = hashlib.pbkdf2_hmac(HASH_NAME, token.encode(), salt, HASH_ITERATIONS)
    return base64.b64encode(salt + hashed).decode()


def verify_token(token: str, stored_token: str) -> bool:
    decoded = base64.b64decode(stored_token)
    salt, pivot_hash = decoded[:SALT_LENGTH], decoded[SALT_LENGTH:]
    current_hash = hashlib.pbkdf2_hmac(HASH_NAME, token.encode(), salt, HASH_ITERATIONS)
    return current_hash == pivot_hash
