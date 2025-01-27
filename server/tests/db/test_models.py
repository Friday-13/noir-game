import pytest
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from server.db.models import UserRepository
from server.db.session import Base


TEST_DB_URL = "sqlite+aiosqlite:///:memory:"

test_engine = create_async_engine(TEST_DB_URL, echo=True)
session_maker = async_sessionmaker(test_engine, expire_on_commit=False)


@pytest.fixture(autouse=True, scope="module")
async def create_tables():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        print("Database cleared successfully.")
        await conn.run_sync(Base.metadata.create_all)
        print("Database created successfully.")


@pytest.fixture(autouse=True, scope="module")
async def test_session():
    async with session_maker() as session:
        yield session


@pytest.mark.asyncio
async def test_create_user(test_session):
    name = "test name"
    email = "user@test.com"
    password = "password"

    user = await UserRepository.create_user(test_session, name, email, password)
    assert user.name == name
    assert user.email == email
