import uuid

from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models


from .managers import UserManager


class UserRole(models.TextChoices):
    OWNER = "OWNER", "Company Owner"
    FINANCE_MANAGER = "FINANCE_MANAGER", "Finance Manager"
    OPERATIONS_MANAGER = "OPERATIONS_MANAGER", "Operations Manager"
    ACCOUNTANT = "ACCOUNTANT", "Accountant"
    VIEWER = "VIEWER", "Viewer / Auditor"



class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    first_name = models.CharField(max_length=100)

    last_name = models.CharField(max_length=100)

    email = models.EmailField(unique=True)

    company = models.ForeignKey(
        "companies.Company",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="employees",
    )

    role = models.CharField(
        max_length=30,
        choices=UserRole.choices,
        default=UserRole.VIEWER,
    )

    phone_number = models.CharField(
        max_length=20,
        blank=True,
    )

    profile_completed = models.BooleanField(default=False)

    is_active = models.BooleanField(default=True)

    is_staff = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email



