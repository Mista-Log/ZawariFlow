from django.urls import path

from .views import (
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
]