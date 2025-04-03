from datetime import datetime, timedelta
from authx import RequestToken, TokenPayload
from fastapi import HTTPException, Response
from passlib.hash import bcrypt
import pytest
from server.db.token_model import TokenRepository
from server.db.user_model import UserModel
from server.utils.api import (
    revocation_check,
    set_access_token,
    set_refresh_token,
    set_user_auth,
    update_user_auth,
    validate_password,
    validate_user_existance,
    validate_user_uniqueness,
)
from server.core.security import auth, config


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


def test_set_access_token():
    response = Response()
    token = set_access_token(response, "1")
    cookie_name = config.JWT_ACCESS_COOKIE_NAME
    assert token is not None
    assert isinstance(token, str)

    cookies = response.headers.get("set-cookie")
    assert cookies is not None
    assert f"{cookie_name}=" in cookies


def test_set_refresh_token():
    response = Response()
    token = set_refresh_token(response, "1")
    cookie_name = config.JWT_REFRESH_COOKIE_NAME
    assert token is not None
    assert isinstance(token, str)

    cookies = response.headers.get("set-cookie")
    assert cookies is not None
    assert f"{cookie_name}=" in cookies


def test_set_user_auth():
    response = Response()
    access_token, refresh_token = set_user_auth(response, "1")

    assert access_token is not None
    assert refresh_token is not None


def test_update_user_auth():
    response = Response()
    exp = datetime.now() + timedelta(hours=2)
    refresh_payload = TokenPayload(sub="1", exp=exp)
    refresh_payload_request = RequestToken(
        token="token-example", location=config.JWT_TOKEN_LOCATION[0]
    )

    access_token, refresh_token = update_user_auth(
        response, refresh_payload, refresh_payload_request
    )

    assert access_token is not None
    assert refresh_token is not None
    assert refresh_token == "token-example"


def test_update_user_auth_update_refresh():
    response = Response()
    exp = datetime.now() - timedelta(hours=2)
    refresh_payload = TokenPayload(sub="1", exp=exp)
    refresh_payload_request = RequestToken(
        token="old-token", location=config.JWT_TOKEN_LOCATION[0]
    )
    access_token, refresh_token = update_user_auth(
        response, refresh_payload, refresh_payload_request
    )

    assert access_token is not None
    assert refresh_token is not None
    assert refresh_token != "old-token"


@pytest.mark.asyncio
async def test_revocation_check_revoked(test_session):
    token = auth.create_access_token(uid="1")
    await TokenRepository.add_token(test_session, token, is_revoked=True)
    with pytest.raises(HTTPException) as excinfo:
        await revocation_check(test_session, token)
    assert excinfo.value.status_code == 401


@pytest.mark.asyncio
async def test_revocation_check_active(test_session):
    token = auth.create_access_token(uid="1")
    await TokenRepository.add_token(test_session, token, is_revoked=False)
    status = await revocation_check(test_session, token)
    assert status is True
