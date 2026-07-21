import base64
import uuid

import requests
from django.conf import settings
from rest_framework.exceptions import ValidationError

from .models import VirtualAccount
from decimal import Decimal

from django.db import transaction
from django.utils import timezone


from apps.companies.models import (
    PurchaseOrder,
    Supplier,
)

from .models import (
    Settlement,
    SettlementStatus,
)

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




@transaction.atomic
def create_settlement(
    *,
    company,
    user,
    purchase_order,
    supplier,
    amount,
):
    """
    Creates a settlement for a supplier.

    NOTE:
    This only creates the settlement record.

    The Monnify disbursement API will be integrated
    after this point.
    """

    # --------------------------------------------------
    # Purchase Order Ownership
    # --------------------------------------------------

    if purchase_order.company != company:
        raise ValidationError(
            {
                "purchase_order":
                    "This purchase order does not belong to your company."
            }
        )

    # --------------------------------------------------
    # Supplier Ownership
    # --------------------------------------------------

    if supplier.company != company:
        raise ValidationError(
            {
                "supplier":
                    "This supplier does not belong to your company."
            }
        )

    # --------------------------------------------------
    # Supplier must belong to PO
    # --------------------------------------------------

    if not purchase_order.suppliers.filter(
        id=supplier.id
    ).exists():
        raise ValidationError(
            {
                "supplier":
                    "Supplier is not attached to this purchase order."
            }
        )

    # --------------------------------------------------
    # Amount Validation
    # --------------------------------------------------

    if amount <= Decimal("0"):
        raise ValidationError(
            {
                "amount":
                    "Settlement amount must be greater than zero."
            }
        )

    if amount > purchase_order.amount:
        raise ValidationError(
            {
                "amount":
                    "Settlement amount cannot exceed purchase order amount."
            }
        )

    # --------------------------------------------------
    # Already Settled
    # --------------------------------------------------

    settled_amount = (
        Settlement.objects.filter(
            purchase_order=purchase_order,
            supplier=supplier,
            status=SettlementStatus.SUCCESS,
        )
        .values_list("amount", flat=True)
    )

    total_settled = sum(
        settled_amount,
        Decimal("0.00"),
    )

    remaining = purchase_order.amount - total_settled

    if amount > remaining:
        raise ValidationError(
            {
                "amount":
                    f"Remaining balance is {remaining}."
            }
        )

    # --------------------------------------------------
    # Create Settlement
    # --------------------------------------------------

    settlement = Settlement.objects.create(
        purchase_order=purchase_order,
        supplier=supplier,
        amount=amount,
        currency=purchase_order.currency,
        created_by=user,
        status=SettlementStatus.PENDING,
    )

    # --------------------------------------------------
    # TODO:
    #
    # Call Monnify Disbursement API here.
    #
    # Example:
    #
    # response = transfer_to_supplier(...)
    #
    # if response.success:
    #
    #     settlement.status = SettlementStatus.SUCCESS
    #
    #     settlement.provider_reference = ...
    #
    #     settlement.settled_at = timezone.now()
    #
    # else:
    #
    #     settlement.status = SettlementStatus.FAILED
    #
    # settlement.save()
    #
    # --------------------------------------------------

    return settlement