from rest_framework import serializers

from .models import PurchaseOrder, PurchaseOrderItem, Supplier

class SupplierSerializer(serializers.ModelSerializer):

    class Meta:
        model = Supplier
        exclude = ("company",)

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