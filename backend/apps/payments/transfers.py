import uuid
from decimal import Decimal

import requests

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from rest_framework.exceptions import ValidationError

from apps.companies.models import PurchaseOrderStatus

from apps.payments.models import (
    Settlement,
    SettlementStatus,
)

from .services import get_access_token

def generate_transaction_reference():
    """
    Generates a unique transfer reference.

    Example:
        SETTLE-9D3FA17A0F8B6C
    """
    return f"SETTLE-{uuid.uuid4().hex[:16].upper()}"


def update_purchase_order_status(purchase_order):
    """
    Synchronizes the purchase order status
    based on successful settlements.
    """

    successful = Settlement.objects.filter(
        purchase_order=purchase_order,
        status=SettlementStatus.SUCCESS,
    )

    total_paid = sum(
        successful.values_list(
            "amount",
            flat=True,
        ),
        Decimal("0.00"),
    )

    if total_paid <= Decimal("0.00"):

        purchase_order.status = (
            PurchaseOrderStatus.APPROVED
        )

    elif total_paid < purchase_order.amount:

        purchase_order.status = (
            PurchaseOrderStatus.PARTIALLY_SETTLED
        )

    else:

        purchase_order.status = (
            PurchaseOrderStatus.SETTLED
        )

    purchase_order.save(
        update_fields=["status"]
    )


def validate_supplier_bank_details(supplier):
    """
    Ensures the supplier has the required
    bank details for settlement.
    """

    if not supplier.bank_code:
        raise ValidationError(
            {
                "bank_code":
                "Supplier bank code is required."
            }
        )

    if not supplier.account_number:
        raise ValidationError(
            {
                "account_number":
                "Supplier account number is required."
            }
        )

    if not supplier.account_name:
        raise ValidationError(
            {
                "account_name":
                "Supplier account name is required."
            }
        )
    

def build_transfer_payload(settlement):
    """
    Builds the Monnify transfer payload.
    """

    supplier = settlement.supplier

    validate_supplier_bank_details(
        supplier
    )

    if not settlement.transaction_reference:

        settlement.transaction_reference = (
            generate_transaction_reference()
        )

        settlement.save(
            update_fields=[
                "transaction_reference"
            ]
        )

    payload = {
        "amount": float(settlement.amount),

        "reference":
            settlement.transaction_reference,

        "narration":
            f"Settlement for {settlement.purchase_order.po_number}",

        "destinationBankCode":
            supplier.bank_code,

        "destinationAccountNumber":
            supplier.account_number,

        "destinationAccountName": supplier.account_name,

        "currency":
            settlement.currency,

        "sourceAccountNumber":
            settings.MONNIFY_SOURCE_ACCOUNT,
    }

    return payload


def save_transfer_response(
    settlement,
    response_body,
):
    """
    Updates settlement after Monnify
    returns a successful response.
    """

    settlement.provider_reference = (
        response_body.get(
            "transactionReference",
            ""
        )
    )

    monnify_status = (
        response_body.get(
            "status",
            ""
        ).upper()
    )

    if monnify_status == "SUCCESS":

        settlement.status = (
            SettlementStatus.SUCCESS
        )

        settlement.settled_at = (
            timezone.now()
        )

    elif monnify_status in (
        "PROCESSING",
        "PENDING_AUTHORIZATION",
    ):

        settlement.status = (
            SettlementStatus.PROCESSING
        )

    else:

        settlement.status = (
            SettlementStatus.FAILED
        )

    settlement.save()

    update_purchase_order_status(
        settlement.purchase_order
    )

    return settlement

@transaction.atomic
def process_settlement(settlement):
    """
    Initiates a bank transfer through Monnify.

    Returns the updated Settlement instance.

    Possible statuses:

    - SUCCESS
    - PROCESSING
    - FAILED

    If OTP is enabled on the merchant account,
    Monnify usually returns
    PENDING_AUTHORIZATION.
    """

    if settlement.status == SettlementStatus.SUCCESS:
        raise ValidationError(
            {
                "detail":
                "Settlement has already been processed."
            }
        )

    token = get_access_token()

    payload = build_transfer_payload(
        settlement
    )

    headers = {
        "Authorization":
            f"Bearer {token}",
        "Content-Type":
            "application/json",
    }

    response = requests.post(
        (
            f"{settings.MONNIFY_BASE_URL}"
            "/api/v2/disbursements/single"
        ),
        headers=headers,
        json=payload,
        timeout=60,
    )

    print(payload)

    data = response.json()

    print("=" * 70)
    print("MONNIFY TRANSFER")
    print(response.status_code)
    print(data)
    print("=" * 70)

    settlement.raw_response = data

    settlement.save(
        update_fields=["raw_response"]
    )

    if response.status_code >= 400:

        settlement.status = (
            SettlementStatus.FAILED
        )

        settlement.save(
            update_fields=["status"]
        )

        raise ValidationError(
            {
                "detail":
                data.get(
                    "responseMessage",
                    "Unable to process settlement."
                )
            }
        )
    
    
    if not data.get(
        "requestSuccessful"
    ):

        settlement.status = (
            SettlementStatus.FAILED
        )

        settlement.save(
            update_fields=["status"]
        )

        raise ValidationError(
            {
                "detail":
                data.get(
                    "responseMessage",
                    "Settlement failed."
                )
            }
        )


    body = data.get(
        "responseBody",
        {}
    )

    save_transfer_response(
        settlement,
        body,
    )

    return settlement


def authorize_transfer_otp(reference, otp):
    """
    Authorize a Monnify transfer using the OTP
    sent to the merchant.
    """

    token = get_access_token()

    response = requests.post(
        (
            f"{settings.MONNIFY_BASE_URL}"
            "/api/v2/disbursements/single/validate-otp"
        ),
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        json={
            "reference": reference,
            "authorizationCode": otp,
        },
        timeout=60,
    )

    data = response.json()

    print("=" * 70)
    print("MONNIFY OTP AUTHORIZATION")
    print(response.status_code)
    print(data)
    print("=" * 70)

    if response.status_code >= 400:
        raise ValidationError(
            {
                "detail": data.get(
                    "responseMessage",
                    "OTP authorization failed.",
                )
            }
        )

    if not data.get("requestSuccessful"):
        raise ValidationError(
            {
                "detail": data.get(
                    "responseMessage",
                    "OTP authorization failed.",
                )
            }
        )

    return data["responseBody"]



def get_transfer_status(settlement):
    """
    Retrieve the latest transfer status
    from Monnify.
    """

    if not settlement.provider_reference:
        raise ValidationError(
            {
                "detail":
                    "This settlement has no provider reference."
            }
        )

    token = get_access_token()

    response = requests.get(
        (
            f"{settings.MONNIFY_BASE_URL}"
            f"/api/v2/disbursements/single/summary"
            f"?reference={settlement.provider_reference}"
        ),
        headers={
            "Authorization": f"Bearer {token}",
        },
        timeout=60,
    )

    data = response.json()

    

    print("=" * 70)
    print("MONNIFY TRANSFER STATUS")
    print(response.status_code)
    print(data)
    print("=" * 70)

    if response.status_code >= 400:
        raise ValidationError(
            {
                "detail": data.get(
                    "responseMessage",
                    "Unable to fetch transfer status.",
                )
            }
        )

    if not data.get("requestSuccessful"):
        raise ValidationError(
            {
                "detail": data.get(
                    "responseMessage",
                    "Unable to fetch transfer status.",
                )
            }
        )

    body = data["responseBody"]

    status = body.get("status", "").upper()

    if status == "SUCCESS":
        settlement.status = SettlementStatus.SUCCESS
        settlement.settled_at = timezone.now()

    elif status in ("PROCESSING", "PENDING_AUTHORIZATION"):
        settlement.status = SettlementStatus.PROCESSING

    elif status == "FAILED":
        settlement.status = SettlementStatus.FAILED

    settlement.save()

    update_purchase_order_status(
        settlement.purchase_order
    )

    return body