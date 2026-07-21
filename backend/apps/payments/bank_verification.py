import requests

from django.conf import settings

from rest_framework.exceptions import ValidationError

from .services import get_access_token


def _request(method, endpoint, *, params=None, payload=None):
    """
    Internal helper for making authenticated Monnify requests.

    Raises ValidationError whenever Monnify returns
    an unsuccessful response.
    """

    token = get_access_token()

    response = requests.request(
        method=method,
        url=f"{settings.MONNIFY_BASE_URL}{endpoint}",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        params=params,
        json=payload,
        timeout=60,
    )

    try:
        data = response.json()
    except Exception:
        raise ValidationError(
            {
                "detail": "Unable to communicate with Monnify."
            }
        )

    if response.status_code >= 400:
        raise ValidationError(
            {
                "detail": data.get(
                    "responseMessage",
                    "Monnify request failed.",
                )
            }
        )

    if not data.get("requestSuccessful", False):
        raise ValidationError(
            {
                "detail": data.get(
                    "responseMessage",
                    "Monnify request failed.",
                )
            }
        )

    return data["responseBody"]


def get_banks():
    """
    Fetch all supported banks from Monnify.

    Returns:

    [
        {
            "name": "...",
            "code": "..."
        }
    ]
    """

    body = _request(
        "GET",
        "/api/v1/banks",
    )

    banks = []

    for bank in body:

        banks.append(
            {
                "name": bank["name"],
                "code": bank["code"],
            }
        )

    return sorted(
        banks,
        key=lambda bank: bank["name"],
    )


def verify_bank_account(
    *,
    account_number,
    bank_code,
):
    """
    Verify a bank account with Monnify.

    Returns:

    {
        "account_name": "...",
        "account_number": "...",
        "bank_code": "...",
        "bank_name": "..."
    }
    """

    body = _request(
        "GET",
        "/api/v1/disbursements/account/validate",
        params={
            "accountNumber": account_number,
            "bankCode": bank_code,
        },
    )


    return {
        "bank_code": body["bankCode"],
        "account_number": body["accountNumber"],
        "account_name": body["accountName"],
    }