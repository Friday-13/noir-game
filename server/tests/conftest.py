from httpx import ASGITransport, AsyncClient
import pytest
from server.main import app
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from server.db.session import Base, get_session
from server.schemas.auth import UserRegisterScheme
import pytest_asyncio

TEST_DB_URL = "sqlite+aiosqlite:///:memory:"

test_engine = create_async_engine(TEST_DB_URL, echo=False)
session_maker = async_sessionmaker(test_engine, expire_on_commit=False)


@pytest.fixture(autouse=True, scope="module")
async def create_tables():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

@pytest.fixture(autouse=True, scope="module")
async def test_session():
    async with session_maker() as session:
        yield session

async def get_test_session():
    async with session_maker() as session:
        yield session

app.dependency_overrides[get_session] = get_test_session

@pytest.fixture
def test_user() -> UserRegisterScheme:
    name = "username"
    email = "user@example.com"
    password = "testpassword"
    return UserRegisterScheme(name=name, email=email, password=password)

@pytest_asyncio.fixture(loop_scope="package")
async def client():
    async with AsyncClient(
        transport=ASGITransport(app), base_url="http://testserver"
    ) as client:
        yield client
