import copy

from fastapi.testclient import TestClient

from server.main import app
from server.core.security import config, auth
from server.schemas.auth import UserLoginScheme, UserRegisterScheme

client = TestClient(app)


def test_register(test_user: UserRegisterScheme):
    response = client.post("/register", json=test_user.model_dump())
    assert response.status_code == 200


def test_register_dublicate_name(test_user: UserRegisterScheme):
    test_user_copy: UserRegisterScheme = copy.copy(test_user)
    test_user_copy.email = "another@email.com"
    response = client.post("/register", json=test_user_copy.model_dump())
    assert response.status_code == 401


def test_register_dublicate_email(test_user: UserRegisterScheme):
    test_user_copy: UserRegisterScheme = copy.copy(test_user)
    test_user_copy.name = "another name"
    response = client.post("/register", json=test_user.model_dump())
    assert response.status_code == 401


def test_login_by_name(test_user: UserRegisterScheme):
    user = UserLoginScheme(email_or_name=test_user.name, password=test_user.password)
    response = client.post("/login", json=user.model_dump())
    assert response.status_code == 200


def test_login_by_email(test_user: UserRegisterScheme):
    user = UserLoginScheme(email_or_name=test_user.email, password=test_user.password)
    response = client.post("/login", json=user.model_dump())
    assert response.status_code == 200


def test_login_wrong_password(test_user: UserRegisterScheme):
    user = UserLoginScheme(email_or_name=test_user.name, password="wrong pass")
    response = client.post("/login", json=user.model_dump())
    assert response.status_code == 401


def test_login_wrong_name(test_user: UserRegisterScheme):
    user = UserLoginScheme(email_or_name="wrong name", password=test_user.password)
    response = client.post("/login", json=user.model_dump())
    assert response.status_code == 401


def test_protected(test_user):
    user = UserLoginScheme(email_or_name=test_user.name, password=test_user.password)
    login_response = client.post("/login", json=user.model_dump())
    login_cookies = login_response.cookies
    access_token = login_cookies.get(config.JWT_ACCESS_COOKIE_NAME)
    csrf_token = login_cookies.get(config.JWT_ACCESS_CSRF_COOKIE_NAME)

    assert access_token is not None
    assert csrf_token is not None

    headers = {"x-csrf-token": csrf_token}
    response = client.get(
        "/protected",
        headers=headers,
        cookies={config.JWT_ACCESS_COOKIE_NAME: access_token},
    )
    assert response.status_code == 200


def test_protected_without_csrf_token(test_user):
    user = UserLoginScheme(email_or_name=test_user.name, password=test_user.password)
    login_response = client.post("/login", json=user.model_dump())
    login_cookies = login_response.cookies
    access_token = login_cookies.get(config.JWT_ACCESS_COOKIE_NAME)
    csrf_token = login_cookies.get(config.JWT_ACCESS_CSRF_COOKIE_NAME)

    assert access_token is not None
    assert csrf_token is not None

    response = client.get(
        "/protected", cookies={config.JWT_ACCESS_COOKIE_NAME: access_token}
    )
    assert response.status_code == 403


def test_protected_without_access_token(test_user):
    user = UserLoginScheme(email_or_name=test_user.name, password=test_user.password)
    login_response = client.post("/login", json=user.model_dump())
    login_cookies = login_response.cookies
    access_token = login_cookies.get(config.JWT_ACCESS_COOKIE_NAME)
    csrf_token = login_cookies.get(config.JWT_ACCESS_CSRF_COOKIE_NAME)
    refresh_token = login_cookies.get(config.JWT_REFRESH_COOKIE_NAME)
    csrf_refresh_token = login_cookies.get(config.JWT_REFRESH_CSRF_COOKIE_NAME)

    assert access_token is not None
    assert csrf_token is not None
    assert refresh_token is not None
    assert csrf_refresh_token is not None

    headers = {"x-csrf-token": csrf_token}
    response = client.get("/protected", headers=headers)
    assert response.status_code == 401


def test_refresh(test_user):
    user = UserLoginScheme(email_or_name=test_user.name, password=test_user.password)
    login_response = client.post("/login", json=user.model_dump())
    login_cookies = login_response.cookies
    refresh_token = login_cookies.get(config.JWT_REFRESH_COOKIE_NAME)
    csrf_refresh_token = login_cookies.get(config.JWT_REFRESH_CSRF_COOKIE_NAME)

    assert refresh_token is not None
    assert csrf_refresh_token is not None

    headers = {"x-csrf-token": csrf_refresh_token}
    refresh_response = client.post(
        "/refresh",
        headers=headers,
        cookies={config.JWT_REFRESH_COOKIE_NAME: refresh_token},
    )
    assert refresh_response.status_code == 200

def test_refresh_without_refresh_token(test_user):
    user = UserLoginScheme(email_or_name=test_user.name, password=test_user.password)
    login_response = client.post("/login", json=user.model_dump())
    login_cookies = login_response.cookies
    refresh_token = login_cookies.get(config.JWT_REFRESH_COOKIE_NAME)
    csrf_refresh_token = login_cookies.get(config.JWT_REFRESH_CSRF_COOKIE_NAME)

    assert refresh_token is not None
    assert csrf_refresh_token is not None

    headers = {"x-csrf-token": csrf_refresh_token}
    refresh_response = client.post(
        "/refresh",
        headers=headers,
    )
    assert refresh_response.status_code == 401


def test_refresh_without_wrong_refresh_token(test_user):
    user = UserLoginScheme(email_or_name=test_user.name, password=test_user.password)
    login_response = client.post("/login", json=user.model_dump())
    login_cookies = login_response.cookies
    refresh_token = login_cookies.get(config.JWT_REFRESH_COOKIE_NAME) 
    csrf_refresh_token = login_cookies.get(config.JWT_REFRESH_CSRF_COOKIE_NAME)

    assert refresh_token is not None
    assert csrf_refresh_token is not None


    wrong_refresh_token = auth.create_refresh_token(uid=str("wrong"))

    headers = {"x-csrf-token": csrf_refresh_token}
    refresh_response = client.post(
        "/refresh",
        headers=headers,
        cookies={config.JWT_REFRESH_COOKIE_NAME: wrong_refresh_token},
    )
    assert refresh_response.status_code == 401
