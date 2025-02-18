from typing import Any, Optional

from authx import AuthX, TokenPayload
from authx.types import DateTimeExpression, StringOrSequence


class AuthXWithPayloads(AuthX):
    def create_access_token_payload(  # pylint: disable=too-many-positional-arguments
        self,
        uid: str,
        fresh: bool = False,
        expiry: Optional[DateTimeExpression] = None,
        data: Optional[dict[str, Any]] = None,
        audience: Optional[StringOrSequence] = None,
    ) -> TokenPayload:
        return self._create_token_payload(
            uid=uid,
            token_type="access",
            fresh=fresh,
            expiry=expiry,
            data=data,
            audience=audience,
        )

    def create_refresh_token_payload(  # pylint: disable=too-many-positional-arguments
        self,
        uid: str,
        fresh: bool = False,
        expiry: Optional[DateTimeExpression] = None,
        data: Optional[dict[str, Any]] = None,
        audience: Optional[StringOrSequence] = None,
    ) -> TokenPayload:
        return self._create_token_payload(
            uid=uid,
            token_type="refresh",
            fresh=fresh,
            expiry=expiry,
            data=data,
            audience=audience,
        )

    def _create_token_payload(  # pylint: disable=too-many-positional-arguments
        self,
        uid: str,
        token_type: str,
        fresh: bool = False,
        expiry: Optional[DateTimeExpression] = None,
        data: Optional[dict[str, Any]] = None,
        audience: Optional[StringOrSequence] = None,
    ) -> TokenPayload:
        payload = self._create_payload(
            uid=uid,
            type=token_type,
            fresh=fresh,
            expiry=expiry,
            data=data,
            audience=audience,
        )
        return payload
