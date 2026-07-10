import requests
import uuid
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from .models import VirtualAccount
from apps.companies.models import Supplier
from rest_framework.exceptions import ValidationError





def get_access_token():
    response = requests.post(
        f"{settings.NOMBA_BASE_URL}/auth/token/issue",
        headers={
            "Content-Type": "application/json",
            "accountId": settings.NOMBA_ACCOUNT_ID,
        },
        json={
            "grant_type": "client_credentials",
            "client_id": settings.NOMBA_CLIENT_ID,
            "client_secret": settings.NOMBA_CLIENT_SECRET,
        },
        timeout=30,
    )

    response.raise_for_status()

    return response.json()["data"]["access_token"]



def refresh_access_token(refresh_token):
    response = requests.post(
        f"{settings.NOMBA_BASE_URL}/auth/token/refresh",
        headers={
            "Content-Type": "application/json",
            "accountId": settings.NOMBA_ACCOUNT_ID,
        },
        json={
            "refresh_token": refresh_token,
        },
        timeout=30,
    )

    response.raise_for_status()

    return response.json()["data"]

def create_virtual_account(
    supplier,
    expected_amount=None,
    expiry_date=None,
):
    token = get_access_token()

    payload = {
        "accountRef": f"VA-{uuid.uuid4().hex[:12].upper()}",
        "accountName": supplier.name,
    }

    if VirtualAccount.objects.filter(supplier=supplier).exists():
        raise ValidationError({
            "detail": "This supplier already has a virtual account."
        })

    if expected_amount:
        payload["amount"] = int(expected_amount)

    if expiry_date is None:
        expiry_date = timezone.now() + timedelta(hours=1)

    if expiry_date:
        payload["expiryDate"] = expiry_date.strftime("%Y-%m-%d")

    response = requests.post(
        f"{settings.NOMBA_BASE_URL}/accounts/virtual",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "accountId": settings.NOMBA_ACCOUNT_ID,
        },
        json=payload,
        timeout=30,
    )

    response_data = response.json()

    print("Nomba Response")
    print(response.status_code)
    print(response_data)

    if not response.ok:
        # If Nomba says the account already exists locally,
        # check if we already saved it.
        if (
            response.status_code == 400
            and "already exists"
            in response_data.get("description", "").lower()
        ):
            account = VirtualAccount.objects.filter(
                supplier=supplier
            ).first()

            if account:
                return account

        raise ValidationError(
            {
                "detail": response_data.get(
                    "description",
                    "Unable to create virtual account."
                )
            }
        )

    data = response_data["data"]

    account = VirtualAccount.objects.create(
        supplier=supplier,
        company=supplier.company,

        account_reference=data["accountRef"],

        account_name=data["accountName"],
        account_number=data["bankAccountNumber"],
        bank_name=data["bankName"],
        bank_account_name=data["bankAccountName"],

        account_holder_id=data["accountHolderId"],
        provider_account_id=data["accountHolderId"],

        currency=data["currency"],

        expires_at=data["expiryDate"],
        is_expired=data["expired"],

        provider="NOMBA",

        raw_response=data,
    )

    return account