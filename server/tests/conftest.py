import pytest
from server.schemas.auth import UserRegisterScheme


@pytest.fixture
def test_user() -> UserRegisterScheme:
    name = "username"
    email = "user@example.com"
    password = "testpassword"
    return UserRegisterScheme(name=name, email=email, password=password)
