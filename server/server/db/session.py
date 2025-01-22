from typing import Annotated
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

DB_URL = "sqlite+aiosqlite:///noir.db"

engine = create_async_engine(DB_URL, echo=True)
session_maker = async_sessionmaker(engine, expire_on_commit=False)

async def get_session():
    async with session_maker() as session:
        yield session


SessionDep = Annotated[AsyncSession, Depends(get_session)]

class Base(DeclarativeBase):
    pass


