from drf_spectacular.utils import extend_schema
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Supplier
from .serializers import (
    SupplierSerializer,
    SupplierResponseSerializer,
)


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