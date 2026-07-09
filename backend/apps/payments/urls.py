from django.urls import path

from .views import (
    CreateVirtualAccountView,
    VirtualAccountListView,
)

urlpatterns = [
    path(
        "virtual-accounts/create/",
        CreateVirtualAccountView.as_view(),
        name="create-virtual-account",
    ),

    path(
        "virtual-accounts/",
        VirtualAccountListView.as_view(),
        name="virtual-account-list",
    ),
]