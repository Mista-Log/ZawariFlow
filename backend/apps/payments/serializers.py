from rest_framework import serializers
from .models import VirtualAccount
from apps.companies.models import Supplier



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