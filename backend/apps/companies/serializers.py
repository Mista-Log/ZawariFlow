from rest_framework import serializers

from .models import PurchaseOrder, PurchaseOrderItem, Supplier
from rest_framework import serializers


class SupplierSerializer(serializers.ModelSerializer):
    virtual_account = serializers.SerializerMethodField()

    class Meta:
        model = Supplier
        exclude = ("company",)

    def get_virtual_account(self, obj):
        account = getattr(obj, "virtual_account", None)

        if account is None:
            return None

        return {
            "account_number": account.account_number,
            "bank_name": account.bank_name,
            "account_name": account.account_name,
        }

class SupplierResponseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Supplier
        fields = "__all__"


class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrderItem
        fields = (
            "name",
            "quantity",
            "unit",
        )

class PurchaseOrderSerializer(serializers.ModelSerializer):
    items = PurchaseOrderItemSerializer(many=True)

    suppliers = serializers.PrimaryKeyRelatedField(
        queryset=Supplier.objects.all(),
        many=True,
    )

    class Meta:
        model = PurchaseOrder

        fields = (
            "id",
            "buyer",
            "amount",
            "currency",
            "suppliers",
            "notes",
            "items",
            "status",
            "po_number",
        )

        read_only_fields = (
            "id",
            "status",
            "po_number",
        )

    def create(self, validated_data):
        suppliers = validated_data.pop("suppliers")
        items = validated_data.pop("items")

        purchase_order = PurchaseOrder.objects.create(
            **validated_data
        )

        purchase_order.suppliers.set(suppliers)

        PurchaseOrderItem.objects.bulk_create(
            [
                PurchaseOrderItem(
                    purchase_order=purchase_order,
                    **item,
                )
                for item in items
            ]
        )

        return purchase_order
    
class PurchaseOrderResponseSerializer(serializers.ModelSerializer):
    items = PurchaseOrderItemSerializer(many=True, read_only=True)
    suppliers = SupplierSerializer(many=True, read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = (
            "id",
            "po_number",
            "buyer",
            "amount",
            "currency",
            "status",
            "notes",
            "suppliers",
            "items",
            "created_at",
            "updated_at",
        )

class PurchaseOrderItemResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrderItem
        fields = (
            "id",
            "name",
            "quantity",
            "unit",
        )

class PurchaseOrderListSerializer(serializers.ModelSerializer):
    suppliers = serializers.SerializerMethodField()
    created = serializers.SerializerMethodField()
    items = PurchaseOrderItemResponseSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = PurchaseOrder

        fields = (
            "id",
            "po_number",
            "buyer",
            "amount",
            "currency",
            "suppliers",
            "status",
            "created",
            "items",
        )

    def get_suppliers(self, obj):
        return obj.suppliers.count()

    def get_created(self, obj):
        return obj.created_at.strftime("%b %d")
    
class PurchaseOrderDetailSerializer(serializers.ModelSerializer):
    items = PurchaseOrderItemResponseSerializer(
        many=True,
        read_only=True,
    )

    suppliers = SupplierSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = PurchaseOrder

        fields = (
            "id",
            "po_number",
            "buyer",
            "amount",
            "currency",
            "status",
            "notes",
            "suppliers",
            "items",
            "created_at",
            "updated_at",
        )