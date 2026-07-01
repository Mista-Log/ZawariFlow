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
