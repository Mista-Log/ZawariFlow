from rest_framework import serializers
from .models import VirtualAccount
from apps.companies.models import Supplier
from decimal import Decimal

from rest_framework import serializers

from apps.companies.models import (
    PurchaseOrder,
    Supplier,
)

from .models import Settlement


class VirtualAccountCreateSerializer(serializers.Serializer):
    supplier = serializers.PrimaryKeyRelatedField(
        queryset=Supplier.objects.all()
    )




class VirtualAccountSerializer(serializers.ModelSerializer):
    supplier = serializers.CharField(
        source="supplier.name",
        read_only=True,
    )

    company = serializers.CharField(
        source="company.name",
        read_only=True,
    )

    class Meta:
        model = VirtualAccount
        fields = (
            "id",
            "supplier",
            "company",

            "account_name",
            "account_number",
            "bank_name",

            "account_reference",

            "currency",

            "provider",

            "status",

            "created_at",
        )






class SettlementCreateSerializer(serializers.Serializer):
    purchase_order = serializers.PrimaryKeyRelatedField(
        queryset=PurchaseOrder.objects.all()
    )

    supplier = serializers.PrimaryKeyRelatedField(
        queryset=Supplier.objects.all()
    )

    amount = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
    )


class SettlementResponseSerializer(serializers.ModelSerializer):
    purchase_order = serializers.CharField(
        source="purchase_order.po_number",
        read_only=True,
    )

    supplier = serializers.CharField(
        source="supplier.name",
        read_only=True,
    )

    class Meta:
        model = Settlement
        fields = (
            "id",
            "purchase_order",
            "supplier",
            "amount",
            "currency",
            "status",
            "provider_reference",
            "settled_at",
            "created_at",
        )


class SettlementListSerializer(serializers.ModelSerializer):
    purchase_order = serializers.CharField(
        source="purchase_order.po_number"
    )

    supplier = serializers.CharField(
        source="supplier.name"
    )

    class Meta:
        model = Settlement

        fields = (
            "id",
            "purchase_order",
            "supplier",
            "amount",
            "currency",
            "status",
            "created_at",
        )


class SettlementDetailSerializer(serializers.ModelSerializer):
    purchase_order = serializers.SerializerMethodField()

    supplier = serializers.SerializerMethodField()

    class Meta:
        model = Settlement

        fields = (
            "id",
            "purchase_order",
            "supplier",
            "amount",
            "currency",
            "status",
            "provider_reference",
            "settled_at",
            "created_at",
            "updated_at",
        )

    def get_purchase_order(self, obj):
        return {
            "id": obj.purchase_order.id,
            "po_number": obj.purchase_order.po_number,
            "buyer": obj.purchase_order.buyer,
            "amount": obj.purchase_order.amount,
            "status": obj.purchase_order.status,
        }

    def get_supplier(self, obj):
        return {
            "id": obj.supplier.id,
            "name": obj.supplier.name,
            "country": obj.supplier.country,
            "bank_name": obj.supplier.bank_name,
            "account_name": obj.supplier.account_name,
            "account_number": obj.supplier.account_number,
        }
    
class SettlementProcessResponseSerializer(serializers.ModelSerializer):
    purchase_order = serializers.CharField(
        source="purchase_order.po_number",
        read_only=True,
    )

    supplier = serializers.CharField(
        source="supplier.name",
        read_only=True,
    )

    class Meta:
        model = Settlement
        fields = (
            "id",
            "purchase_order",
            "supplier",
            "amount",
            "currency",
            "status",
            "provider_reference",
            "transaction_reference",
            "settled_at",
        )

class AuthorizeTransferSerializer(serializers.Serializer):
    reference = serializers.CharField(
        help_text="Settlement transaction reference."
    )

    authorization_code = serializers.CharField(
        max_length=10,
        help_text="OTP received from Monnify."
    )


class AuthorizeTransferResponseSerializer(serializers.Serializer):
    message = serializers.CharField()

    reference = serializers.CharField()

    status = serializers.CharField()


class TransferStatusSerializer(serializers.Serializer):
    reference = serializers.CharField()

    provider_reference = serializers.CharField(
        allow_blank=True,
    )

    status = serializers.CharField()

    amount = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
    )

    narration = serializers.CharField(
        allow_blank=True,
    )

    settled_at = serializers.DateTimeField(
        allow_null=True,
    )

class SettlementStatusResponseSerializer(serializers.ModelSerializer):
    purchase_order = serializers.CharField(
        source="purchase_order.po_number",
        read_only=True,
    )

    supplier = serializers.CharField(
        source="supplier.name",
        read_only=True,
    )

    class Meta:
        model = Settlement

        fields = (
            "id",
            "purchase_order",
            "supplier",
            "amount",
            "currency",
            "status",
            "provider_reference",
            "transaction_reference",
            "settled_at",
            "updated_at",
        )

# ---------------------------------------------------------
# Process Settlement
# ---------------------------------------------------------

class ProcessSettlementResponseSerializer(serializers.ModelSerializer):
    purchase_order = serializers.CharField(
        source="purchase_order.po_number",
        read_only=True,
    )

    supplier = serializers.CharField(
        source="supplier.name",
        read_only=True,
    )

    class Meta:
        model = Settlement

        fields = (
            "id",
            "purchase_order",
            "supplier",
            "amount",
            "currency",
            "status",
            "provider_reference",
            "transaction_reference",
            "settled_at",
            "created_at",
        )


# ---------------------------------------------------------
# OTP Authorization
# ---------------------------------------------------------

class OTPAuthorizationSerializer(serializers.Serializer):
    reference = serializers.CharField()
    authorizationCode = serializers.CharField()


# ---------------------------------------------------------
# OTP Response
# ---------------------------------------------------------

class OTPAuthorizationResponseSerializer(serializers.Serializer):
    requestSuccessful = serializers.BooleanField()
    responseMessage = serializers.CharField()
    responseCode = serializers.CharField()


# ---------------------------------------------------------
# Transfer Status
# ---------------------------------------------------------

class TransferStatusSerializer(serializers.Serializer):
    transactionReference = serializers.CharField()
    status = serializers.CharField()
    amount = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
    )
    narration = serializers.CharField()
    createdOn = serializers.CharField()


# ==========================================================
# Supplier Bank Verification
# ==========================================================

class SupplierBankAccountSerializer(serializers.Serializer):
    """
    Request serializer for verifying and saving
    a supplier's payout bank account.
    """

    bank_code = serializers.CharField(max_length=10)
    bank_name = serializers.CharField(max_length=100)
    account_number = serializers.CharField(max_length=20)


class VerifiedBankAccountSerializer(serializers.Serializer):
    """
    Response returned after successful verification.
    """

    bank_name = serializers.CharField()

    bank_code = serializers.CharField()

    account_number = serializers.CharField()

    account_name = serializers.CharField()


# ==========================================================
# Supported Banks
# ==========================================================

class BankSerializer(serializers.Serializer):
    """
    Represents one supported bank.
    """

    name = serializers.CharField()

    code = serializers.CharField()