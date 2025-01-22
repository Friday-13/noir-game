from typing import Union
from pydantic import BaseModel, EmailStr, Field


class UserLoginScheme(BaseModel):
    email_or_username: Union[EmailStr, str] = Field(max_length=255)
    password: str = Field(max_length=255)

class UserRegisterScheme(BaseModel):
    email: EmailStr = Field(max_length=255)
    username: str = Field(max_length=50)
    password: str = Field(max_length=255)
