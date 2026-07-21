import uuid

from django.db import models

from apps.companies.models import Supplier


class VirtualAccountStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    ACTIVE = "ACTIVE", "Active"
    DISABLED = "DISABLED", "Disabled"
    CLOSED = "CLOSED", "Closed"


class VirtualAccount(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    supplier = models.OneToOneField(
        Supplier,
        on_delete=models.CASCADE,
        related_name="virtual_account",
    )

    account_name = models.CharField(
        max_length=255,
    )

    account_number = models.CharField(
        max_length=20,
        unique=True,
    )

    bank_name = models.CharField(
        max_length=100,
    )

    company = models.ForeignKey(
        "companies.Company",
        on_delete=models.CASCADE,
        related_name="virtual_accounts",
        null=True,
        blank=True,
    )

    account_reference = models.CharField(
        max_length=100,
        unique=True,
        blank = True,
    )


    bank_account_name = models.CharField(
        max_length=255,
        blank=True,
    )

    account_holder_id = models.CharField(
        max_length=255,
        blank=True,
    )

    currency = models.CharField(
        max_length=10,
        default="NGN",
    )

    expires_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    is_expired = models.BooleanField(
        default=False,
    )

    raw_response = models.JSONField(
        default=dict,
    )

    provider = models.CharField(
        max_length=30,
        default="MONNIFY",
    )

    customer_email = models.EmailField(
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=VirtualAccountStatus.choices,
        default=VirtualAccountStatus.PENDING,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return self.account_number
    
class TransactionType(models.TextChoices):
    CREDIT = "CREDIT", "Credit"
    DEBIT = "DEBIT", "Debit"


class TransactionStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    SUCCESS = "SUCCESS", "Success"
    FAILED = "FAILED", "Failed"


class PaymentTransaction(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    virtual_account = models.ForeignKey(
        VirtualAccount,
        on_delete=models.CASCADE,
        related_name="transactions",
    )

    purchase_order = models.ForeignKey(
        "companies.PurchaseOrder",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="transactions",
    )

    amount = models.DecimalField(
        max_digits=18,
        decimal_places=2,
    )

    currency = models.CharField(
        max_length=10,
        default="NGN",
    )

    transaction_type = models.CharField(
        max_length=20,
        choices=TransactionType.choices,
    )

    status = models.CharField(
        max_length=20,
        choices=TransactionStatus.choices,
        default=TransactionStatus.PENDING,
    )

    provider_reference = models.CharField(
        max_length=255,
        unique=True,
    )

    transaction_reference = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )

    narration = models.TextField(
        blank=True,
    )

    paid_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return self.transaction_reference
    
class SettlementStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    PROCESSING = "PROCESSING", "Processing"
    SUCCESS = "SUCCESS", "Success"
    FAILED = "FAILED", "Failed"


class Settlement(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    purchase_order = models.ForeignKey(
        "companies.PurchaseOrder",
        on_delete=models.CASCADE,
        related_name="settlements",
    )

    supplier = models.ForeignKey(
        "companies.Supplier",
        on_delete=models.CASCADE,
        related_name="settlements",
    )

    amount = models.DecimalField(
        max_digits=18,
        decimal_places=2,
    )

    currency = models.CharField(
        max_length=10,
        default="NGN",
    )

    provider_reference = models.CharField(
        max_length=255,
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=SettlementStatus.choices,
        default=SettlementStatus.PENDING,
    )

    settled_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    transaction_reference = models.CharField(
        max_length=255,
        unique=True,
        blank=True,
        null=True,
    )

    raw_response = models.JSONField(
        default=dict,
        blank=True,
    )

    created_by = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="created_settlements",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return f"{self.purchase_order.po_number} - {self.supplier.name}"
    
class PaymentWebhook(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    event = models.CharField(
        max_length=100,
    )

    provider = models.CharField(
        max_length=50,
        default="NOMBA",
    )

    payload = models.JSONField()

    processed = models.BooleanField(
        default=False,
    )

    received_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return self.event
    
class MonnifyCredential(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    company = models.OneToOneField(
        "companies.Company",
        on_delete=models.CASCADE,
        related_name="monnify_credentials",
    )

    api_key = models.CharField(max_length=255)

    secret_key = models.CharField(max_length=255)

    contract_code = models.CharField(max_length=100)

    environment = models.CharField(
        default="sandbox",
        max_length=20,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )