import uuid

from django.db import models

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

    account_number = models.CharField(
        max_length=100,
        unique=True,
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
    )

    phone_number = models.CharField(
        max_length=20,
        blank=True,
    )

    address = models.TextField(
        blank=True,
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