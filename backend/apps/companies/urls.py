from django.urls import path

from .views import (
    PurchaseOrderCreateView,
    PurchaseOrderDetailView,
    PurchaseOrderListView,
    SupplierListCreateView,
    SupplierDetailView,
)

urlpatterns = [
    path(
        "",
        SupplierListCreateView.as_view(),
        name="supplier-list-create",
    ),
    path(
        "<uuid:id>/",
        SupplierDetailView.as_view(),
        name="supplier-detail",
    ),
    path(
        "purchase-orders/",
        PurchaseOrderListView.as_view(),
        name="purchase-order-list",
    ),

    path(
        "purchase-orders/create/",
        PurchaseOrderCreateView.as_view(),
        name="purchase-order-create",
    ),

    path(
        "purchase-orders/<uuid:id>/",
        PurchaseOrderDetailView.as_view(),
        name="purchase-order-detail",
    ),
]