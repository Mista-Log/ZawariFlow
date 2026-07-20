import base64
import uuid

import requests
from django.conf import settings
from rest_framework.exceptions import ValidationError

from .models import VirtualAccount


def get_access_token():
    """
    Authenticate with Monnify and return an access token.
    """

    credentials = (
        f"{settings.MONNIFY_API_KEY}:{settings.MONNIFY_SECRET_KEY}"
    )

    encoded_credentials = base64.b64encode(
        credentials.encode()
    ).decode()

    response = requests.post(
        f"{settings.MONNIFY_BASE_URL}/api/v1/auth/login",
        headers={
            "Authorization": f"Basic {encoded_credentials}",
            "Content-Type": "application/json",
        },
        timeout=30,
    )

    response.raise_for_status()

    data = response.json()

    if not data.get("requestSuccessful"):
        raise ValidationError(
            {
                "detail": data.get(
                    "responseMessage",
                    "Unable to authenticate with Monnify.",
                )
            }
        )

    return data["responseBody"]["accessToken"]


def create_virtual_account(supplier):
    """
    Creates a Monnify Reserved Account for a supplier.
    """

    if VirtualAccount.objects.filter(supplier=supplier).exists():
        raise ValidationError(
            {
                "detail": "This supplier already has a virtual account."
            }
        )

    token = get_access_token()

    account_reference = (
        f"SUP-{uuid.uuid4().hex[:12].upper()}"
    )

    payload = {
        "accountReference": account_reference,
        "accountName": supplier.name,
        "currencyCode": "NGN",
        "contractCode": settings.MONNIFY_CONTRACT_CODE,
        "customerName": supplier.name,
        "customerEmail": supplier.email,
        "getAllAvailableBanks": True,
    }

    response = requests.post(
        (
            f"{settings.MONNIFY_BASE_URL}"
            "/api/v2/bank-transfer/reserved-accounts"
        ),
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        json=payload,
        timeout=30,
    )

    response_data = response.json()

    print("Monnify Response")
    print(response.status_code)
    print(response_data)

    if not response.ok:
        raise ValidationError(
            {
                "detail": response_data.get(
                    "responseMessage",
                    "Unable to create virtual account.",
                )
            }
        )

    if not response_data.get("requestSuccessful"):
        raise ValidationError(
            {
                "detail": response_data.get(
                    "responseMessage",
                    "Unable to create virtual account.",
                )
            }
        )

    data = response_data["responseBody"]

    accounts = data.get("accounts", [])

    if not accounts:
        raise ValidationError(
            {
                "detail": "No bank account returned by Monnify."
            }
        )

    bank = accounts[0]

    account = VirtualAccount.objects.create(
        supplier=supplier,
        company=supplier.company,

        account_reference=data["accountReference"],

        account_name=data["accountName"],

        account_number=bank["accountNumber"],

        bank_name=bank["bankName"],

        currency=data.get(
            "currencyCode",
            "NGN",
        ),

        provider="MONNIFY",

        status="ACTIVE",

        raw_response=response_data,
    )

    return account