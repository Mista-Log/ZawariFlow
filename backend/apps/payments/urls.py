from django.urls import path

from .views import (
    CreateVirtualAccountView,
    VirtualAccountListView,
    SettlementCreateView,
    SettlementListView,
    SettlementDetailView,
    ProcessSettlementView,
    AuthorizeTransferView,
    SettlementTransferStatusView,
    BankListView,
    SupplierBankAccountView,
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

    path(
        "settlements/",
        SettlementListView.as_view(),
        name="settlement-list",
    ),

    path(
        "settlements/create/",
        SettlementCreateView.as_view(),
        name="settlement-create",
    ),

    path(
        "settlements/<uuid:id>/",
        SettlementDetailView.as_view(),
        name="settlement-detail",
    ),
    path(
        "settlements/<uuid:id>/process/",
        ProcessSettlementView.as_view(),
        name="process-settlement",
    ),

    path(
        "settlements/authorize/",
        AuthorizeTransferView.as_view(),
        name="authorize-settlement",
    ),

    path(
        "settlements/<uuid:id>/status/",
        SettlementTransferStatusView.as_view(),
        name="settlement-status",
    ),
    path(
        "banks/",
        BankListView.as_view(),
        name="bank-list",
    ),

    path(
        "suppliers/<uuid:id>/bank-account/",
        SupplierBankAccountView.as_view(),
        name="supplier-bank-account",
    ),

]