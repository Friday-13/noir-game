import pytest
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from server.db.models import UserModel, UserRepository
from server.db.session import Base
from passlib.hash import bcrypt

from server.schemas.auth import UserRegisterScheme


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
async def test_create_user(test_session, test_user: UserRegisterScheme):
    user = await UserRepository.create_user(
        test_session, test_user.name, test_user.email, test_user.password
    )
    assert user.name == test_user.name
    assert user.email == test_user.email
    assert user.pass_hash != test_user.password
    assert bcrypt.verify(test_user.password, user.pass_hash)


@pytest.mark.asyncio
async def test_get_user_by_id(test_session, test_user: UserRegisterScheme):
    uid = "1"
    user = await UserRepository.get_user(test_session, uid)
    assert not (user is None)
    assert str(user.id) == "1"
    assert user.name == test_user.name


@pytest.mark.asyncio
async def test_get_user_by_email_or_name(test_session, test_user: UserRegisterScheme):
    user1 = await UserRepository.get_user(test_session, email_or_name=test_user.name)
    user2 = await UserRepository.get_user(test_session, email_or_name=test_user.email)
    assert not (user1 is None)
    assert user1.name == test_user.name
    assert not (user2 is None)
    assert user2.name == test_user.name


@pytest.mark.asyncio
async def test_get_user_by_email_and_name(test_session, test_user: UserRegisterScheme):
    user = await UserRepository.get_user(
        test_session, name=test_user.name, email=test_user.email
    )
    assert not (user is None)
    assert user.name == test_user.name


@pytest.mark.asyncio
async def test_get_user_by_name(test_session, test_user: UserRegisterScheme):
    user = await UserRepository.get_user(test_session, name=test_user.name)
    assert not (user is None)
    assert user.name == test_user.name


@pytest.mark.asyncio
async def test_get_user_by_email(test_session, test_user: UserRegisterScheme):
    user = await UserRepository.get_user(test_session, email=test_user.email)
    assert not (user is None)
    assert user.name == test_user.name


@pytest.mark.asyncio
async def test_get_user_without_creditional(test_session):
    with pytest.raises(
        ValueError,
        match="At least one of 'id', 'name', 'email', or 'email_or_name' must be provided",
    ):
        await UserRepository.get_user(test_session)
