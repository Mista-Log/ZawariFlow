from rest_framework import serializers
from .models import VirtualAccount
from apps.companies.models import Supplier



class VirtualAccountCreateSerializer(serializers.Serializer):
    supplier = serializers.PrimaryKeyRelatedField(
        queryset=Supplier.objects.all()
    )

    expected_amount = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
        required=False,
    )

    expiry_date = serializers.DateTimeField(
        required=False,
    )



class VirtualAccountSerializer(serializers.ModelSerializer):
    supplier = serializers.CharField(source="supplier.name", read_only=True)
    company = serializers.CharField(source="company.name", read_only=True)

    class Meta:
        model = VirtualAccount
        fields = (
            "id",
            "supplier",
            "company",
            "account_name",
            "account_number",
            "bank_name",
            "provider",
            "account_reference",
            "bank_account_name",
            "account_holder_id",
            "currency",
            "status",
            "expires_at",
            "is_expired",
            "created_at",
        )