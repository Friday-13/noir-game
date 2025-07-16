from pydantic import BaseModel


class BaseMessage(BaseModel):
    type: str


class AuthMessage(BaseMessage):
    token: str
