from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Supplier
from .serializers import (
    PurchaseOrderResponseSerializer,
    SupplierSerializer,
    SupplierResponseSerializer,
    PurchaseOrderListSerializer,
    PurchaseOrderDetailSerializer,
)

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated



from .models import PurchaseOrder
from .serializers import PurchaseOrderSerializer


class SupplierListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    serializer_class = SupplierSerializer

    def get_queryset(self):
        return Supplier.objects.filter(
            company=self.request.user.company
        )

    def perform_create(self, serializer):
        serializer.save(
            company=self.request.user.company
        )

    @extend_schema(
        tags=["Suppliers"],
        summary="List all suppliers",
    )
    def get(self, *args, **kwargs):
        return super().get(*args, **kwargs)

    @extend_schema(
        tags=["Suppliers"],
        summary="Create supplier",
    )
    def post(self, *args, **kwargs):
        return super().post(*args, **kwargs)
    
class SupplierDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    permission_classes = [IsAuthenticated]

    serializer_class = SupplierSerializer
    lookup_field = "id"

    def get_queryset(self):
        return Supplier.objects.filter(
            company=self.request.user.company
        )

    @extend_schema(
        tags=["Suppliers"],
        summary="Get supplier by ID",
    )
    def get(self, *args, **kwargs):
        return super().get(*args, **kwargs)

    @extend_schema(
        tags=["Suppliers"],
        summary="Update supplier",
    )
    def put(self, *args, **kwargs):
        return super().put(*args, **kwargs)

    @extend_schema(
        tags=["Suppliers"],
        summary="Partially update supplier",
    )
    def patch(self, *args, **kwargs):
        return super().patch(*args, **kwargs)

    @extend_schema(
        tags=["Suppliers"],
        summary="Delete supplier",
    )
    def delete(self, *args, **kwargs):
        return super().delete(*args, **kwargs)
    



@extend_schema(
    tags=["Purchase Orders"],
    summary="Create Purchase Order",
    description=(
        "Creates a new purchase order for the authenticated user's company. "
        "The purchase order may contain multiple suppliers and multiple purchase items."
    ),
    request=PurchaseOrderSerializer,
    responses={
        201: OpenApiResponse(
            response=PurchaseOrderResponseSerializer,
            description="Purchase order created successfully.",
        ),
        400: OpenApiResponse(
            description="Validation error.",
        ),
        401: OpenApiResponse(
            description="Authentication credentials were not provided.",
        ),
    },
)
class PurchaseOrderCreateView(generics.CreateAPIView):
    serializer_class = PurchaseOrderSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(
            company=self.request.user.company,
            created_by=self.request.user,
        )


@extend_schema(
    tags=["Purchase Orders"],
    summary="List Purchase Orders",
    description="Returns all purchase orders belonging to the authenticated user's company.",
    responses={200: PurchaseOrderListSerializer(many=True)},
)
class PurchaseOrderListView(generics.ListAPIView):
    serializer_class = PurchaseOrderListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PurchaseOrder.objects.filter(
            company=self.request.user.company
        ).prefetch_related(
            "suppliers",
            "items",
        )
    

@extend_schema(
    tags=["Purchase Orders"],
    summary="Get Purchase Order",
    description="Retrieve a purchase order and all of its items.",
    responses={200: PurchaseOrderDetailSerializer},
)
class PurchaseOrderDetailView(generics.RetrieveAPIView):
    serializer_class = PurchaseOrderDetailSerializer
    permission_classes = [IsAuthenticated]

    lookup_field = "id"

    def get_queryset(self):
        return PurchaseOrder.objects.filter(
            company=self.request.user.company
        ).prefetch_related(
            "suppliers",
            "items",
        )