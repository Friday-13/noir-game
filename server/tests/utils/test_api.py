from fastapi import HTTPException
from passlib.hash import bcrypt
import pytest
from server.db.models import UserModel
from server.schemas.auth import UserRegisterScheme
from server.utils.api import (
    validate_password,
    validate_user_existance,
    validate_user_uniqueness,
)

@pytest.fixture
def test_user() -> UserRegisterScheme:
    name = "username"
    email = "user@example.com"
    password = "testpassword"
    return UserRegisterScheme(name=name, email=email, password=password)


def test_validate_user_uniquess(test_user):
    user_in_db = None
    try:
        validate_user_uniqueness(test_user, user_in_db)
    except:
        pytest.fail("Unexpected Exception raised!")


def test_validate_user_with_existing_email(test_user):
    user_in_db = UserModel(name=test_user.name, email="", pass_hash="")
    with pytest.raises(HTTPException) as excinfo:
        validate_user_uniqueness(test_user, user_in_db)
    assert excinfo.value.status_code == 401


def test_validate_user_with_existing_username(test_user):
    user_in_db = UserModel(name="", email="user@example.com", pass_hash="")
    with pytest.raises(HTTPException) as excinfo:
        validate_user_uniqueness(test_user, user_in_db)
    assert excinfo.value.status_code == 401


def test_validate_user_existance(test_user):
    try:
        validate_user_existance(test_user)
    except:
        pytest.fail("Unexpected Exception raised!")


def test_validate_user_existance_user_none():
    user = None
    with pytest.raises(HTTPException) as excinfo:
        validate_user_existance(user)
    assert excinfo.value.status_code == 401


def test_validate_password_correct():
    password = "123abcABC"
    password_hash = bcrypt.hash(password)
    try:
        validate_password(password, password_hash)
    except:
        pytest.fail("Unexpected Exception raised!")


def test_validate_password_wrong():
    password = "123abcABC"
    wrong_password = "ABCabc123"
    wrong_password_hash = bcrypt.hash(wrong_password)
    with pytest.raises(HTTPException) as excinfo:
        validate_password(password, wrong_password_hash)
    assert excinfo.value.status_code == 401
