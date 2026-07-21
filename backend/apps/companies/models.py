import uuid

from django.db import models
from decimal import Decimal


# Create your models here.
class Company(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    name = models.CharField(max_length=255)

    registration_number = models.CharField(
        max_length=100,
        unique=True,
    )

    tax_identification_number = models.CharField(
        max_length=100,
        blank=True,
    )

    industry = models.CharField(
        max_length=100,
    )

    country = models.CharField(
        max_length=100,
    )

    address = models.TextField()

    phone_number = models.CharField(
        max_length=20,
    )

    website = models.URLField(
        blank=True,
    )

    owner = models.OneToOneField(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="owned_company",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return self.name


class SupplierCategory(models.TextChoices):
    GOODS = "GOODS", "Goods"
    LOGISTICS = "LOGISTICS", "Logistics"
    TARIFFS = "TARIFFS", "Tariffs"
    SERVICES = "SERVICES", "Services"
    OTHER = "OTHER", "Other"


class SupplierStatus(models.TextChoices):
    VERIFIED = "VERIFIED", "Verified"
    PENDING_KYC = "PENDING_KYC", "Pending KYC"
    SYSTEM = "SYSTEM", "System"
    INACTIVE = "INACTIVE", "Inactive"


class Supplier(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    company = models.ForeignKey(
        "companies.Company",
        on_delete=models.CASCADE,
        related_name="suppliers",
    )

    name = models.CharField(
        max_length=255,
    )

    category = models.CharField(
        max_length=30,
        choices=SupplierCategory.choices,
    )

    country = models.CharField(
        max_length=100,
    )



    transaction_volume = models.DecimalField(
        max_digits=18,
        decimal_places=2,
        default=0,
    )

    bank_name = models.CharField(
        max_length=100,
        blank=True,
        null=True,
    )

    status = models.CharField(
        max_length=30,
        choices=SupplierStatus.choices,
        default=SupplierStatus.PENDING_KYC,
    )

    email = models.EmailField(
        blank=True,
        unique=True,
    )

    phone_number = models.CharField(
        max_length=20,
        blank=True,
    )

    address = models.TextField(
        blank=True,
    )


    bank_code = models.CharField(
        max_length=10,
        null=True,
        blank=True,
    )

    account_name = models.CharField(
        max_length=255,
        null=True,
        blank=True,
    )

    transaction_reference = models.CharField(
        max_length=100,
        blank=True,
        null=True,
    )

    account_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name




class PurchaseOrderStatus(models.TextChoices):
    DRAFT = "DRAFT", "Draft"
    PENDING = "PENDING", "Pending"
    APPROVED = "APPROVED", "Approved"
    PARTIALLY_SETTLED = "PARTIALLY_SETTLED", "Partially Settled"
    SETTLED = "SETTLED", "Settled"
    CANCELLED = "CANCELLED", "Cancelled"


class PurchaseOrder(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    po_number = models.CharField(
        max_length=30,
        unique=True,
    )

    company = models.ForeignKey(
        "companies.Company",
        on_delete=models.CASCADE,
        related_name="purchase_orders",
    )

    buyer = models.CharField(
        max_length=255,
    )

    amount = models.DecimalField(
        max_digits=18,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    currency = models.CharField(
        max_length=10,
        default="NGN",
    )

    suppliers = models.ManyToManyField(
        "companies.Supplier",
        related_name="purchase_orders",
    )

    status = models.CharField(
        max_length=30,
        choices=PurchaseOrderStatus.choices,
        default=PurchaseOrderStatus.DRAFT,
    )

    notes = models.TextField(
        blank=True,
    )
    created_by = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="created_purchase_orders",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def save(self, *args, **kwargs):
        is_new = self._state.adding

        super().save(*args, **kwargs)

        if is_new and not self.po_number:
            self.po_number = f"PO-{self.pk.hex[:8].upper()}"
            super().save(update_fields=["po_number"])

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.po_number
    
class PurchaseOrderItem(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    purchase_order = models.ForeignKey(
        PurchaseOrder,
        on_delete=models.CASCADE,
        related_name="items",
    )

    name = models.CharField(
        max_length=255,
    )

    quantity = models.PositiveIntegerField()

    unit = models.CharField(
        max_length=50,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return f"{self.name} ({self.purchase_order.po_number})"