import pytest

from server.core.security import auth
from server.db.token_model import TokenRepository


def test_add_token_to_session(test_session):
    token = auth.create_access_token(uid="1")
    new_token = TokenRepository._add_token_to_session(test_session, token)

    assert new_token.user_id == "1"
    assert new_token in test_session.new


@pytest.mark.asyncio
async def test_add_token_pair(test_session):
    access_token = auth.create_access_token(uid="1")
    refresh_token = auth.create_refresh_token(uid="1")

    new_access_token, new_refresh_token = await TokenRepository.add_token_pair(
        test_session, access_token, refresh_token
    )

    assert new_access_token.user_id == "1"
    assert new_refresh_token.user_id == "1"


@pytest.mark.asyncio
async def test_add_token(test_session):
    access_token = auth.create_access_token(uid="1")
    new_access_token = await TokenRepository.add_token(test_session, access_token)

    assert new_access_token.user_id == "1"


@pytest.mark.asyncio
async def test_get_token(test_session):
    token = auth.create_access_token(uid="1")
    new_token = await TokenRepository.add_token(test_session, token)
    token_from_db = await TokenRepository.get_token(test_session, token)

    assert token_from_db == new_token


@pytest.mark.asyncio
async def test_get_token_is_missing(test_session):
    token = auth.create_access_token(uid="1")
    missing_token = auth.create_access_token(uid="2")
    await TokenRepository.add_token(test_session, token)
    token_from_db = await TokenRepository.get_token(test_session, missing_token)

    assert token_from_db is None


@pytest.mark.asyncio
async def test_revoke_tokens(test_session):
    tokens = [auth.create_access_token(uid=str(i)) for i in range(0, 10)]

    for token in tokens:
        await TokenRepository.add_token(test_session, token)

    revoke_ids = {3, 5, 6, 1}
    revoking_tokens = [tokens[i] for i in revoke_ids]

    row_count = await TokenRepository.revoke_tokens(test_session, revoking_tokens)
    assert row_count == len(revoke_ids)

    for i in range(0, 10):
        token_from_db = await TokenRepository.get_token(test_session, tokens[i])
        assert token_from_db is not None
        assert token_from_db.is_revoked is (i in revoke_ids)

@pytest.mark.asyncio
async def test_is_active(test_session):
    active_token = auth.create_access_token(uid="1")
    revoked_token = auth.create_access_token(uid="2")
    unsaved_token = auth.create_access_token(uid="3")

    await TokenRepository.add_token(test_session, active_token)
    await TokenRepository.add_token(test_session, revoked_token, is_revoked=True)

    active_token_status = await TokenRepository.is_active(test_session, active_token)
    revoked_token_status = await TokenRepository.is_active(test_session, revoked_token)
    unsaved_token_status = await TokenRepository.is_active(test_session, unsaved_token)

    assert active_token_status is True
    assert revoked_token_status is False
    assert unsaved_token_status is False







