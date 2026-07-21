from drf_spectacular.utils import (
    extend_schema,
    OpenApiResponse,
)

from django.shortcuts import get_object_or_404
from rest_framework import generics

from .models import VirtualAccount
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from apps.companies.models import Supplier

from drf_spectacular.utils import (
    extend_schema,
    OpenApiResponse,
    OpenApiExample,
)

from rest_framework import generics

from .models import Settlement
from .serializers import (
    SettlementCreateSerializer,
    SettlementResponseSerializer,
    SettlementListSerializer,
    SettlementDetailSerializer,
)

from .transfers import (
    process_settlement,
    authorize_transfer_otp,
    get_transfer_status,
)

from .serializers import (
    SettlementProcessResponseSerializer,
    OTPAuthorizationSerializer,
    TransferStatusSerializer,
)

from .bank_verification import (
    get_banks,
    verify_bank_account,
)

from .serializers import (
    BankSerializer,
    SupplierBankAccountSerializer,
    VerifiedBankAccountSerializer,
)

from .services import create_settlement

from .serializers import VirtualAccountCreateSerializer, VirtualAccountSerializer
from .services import create_virtual_account




# Create your views here.
@extend_schema(
    tags=["Virtual Accounts"],
    summary="Create Virtual Account",
    description="Creates a Nomba virtual account for a supplier.",
    request=VirtualAccountCreateSerializer,
    responses={
        201: OpenApiResponse(
            description="Virtual account created successfully."
        ),
        400: OpenApiResponse(
            description="Validation Error."
        ),
        401: OpenApiResponse(
            description="Unauthorized."
        ),
    },
)
class CreateVirtualAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = VirtualAccountCreateSerializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)

        supplier = serializer.validated_data["supplier"]

        if supplier.company != request.user.company:
            return Response(
                {
                    "detail": "Supplier does not belong to your company."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        account = create_virtual_account(
            supplier=supplier
        )

        return Response(
            VirtualAccountSerializer(account).data,
            status=status.HTTP_201_CREATED,
        )
    



@extend_schema(
    tags=["Virtual Accounts"],
    summary="List Virtual Accounts",
    description="Returns every virtual account belonging to the authenticated company.",
    responses=VirtualAccountSerializer(many=True),
)
class VirtualAccountListView(generics.ListAPIView):
    serializer_class = VirtualAccountSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            VirtualAccount.objects.filter(
                company=self.request.user.company
            )
            .select_related(
                "supplier",
                "company",
            )
            .order_by("-created_at")
        )
    


@extend_schema(
    tags=["Settlements"],
    summary="Create Settlement",
    description="""
Creates a settlement request for a supplier.

The API validates that:

- Purchase Order belongs to your company.
- Supplier belongs to your company.
- Supplier belongs to the Purchase Order.
- Settlement amount is valid.

The settlement is created with **PENDING** status.

Future versions will automatically initiate the Monnify transfer.
""",
    request=SettlementCreateSerializer,
    responses={
        201: OpenApiResponse(
            response=SettlementResponseSerializer,
            description="Settlement created successfully.",
        ),
        400: OpenApiResponse(
            description="Validation error.",
        ),
        401: OpenApiResponse(
            description="Authentication required.",
        ),
    },
    examples=[
        OpenApiExample(
            "Create Settlement",
            request_only=True,
            value={
                "purchase_order": "purchase-order-id",
                "supplier": "supplier-id",
                "amount": "250000.00",
            },
        )
    ],
)
class SettlementCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SettlementCreateSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        settlement = create_settlement(
            company=request.user.company,
            user=request.user,
            purchase_order=serializer.validated_data["purchase_order"],
            supplier=serializer.validated_data["supplier"],
            amount=serializer.validated_data["amount"],
        )

        return Response(
            SettlementResponseSerializer(settlement).data,
            status=status.HTTP_201_CREATED,
        )
    


@extend_schema(
    tags=["Settlements"],
    summary="List Settlements",
    description="Returns all settlements belonging to the authenticated company.",
    responses={
        200: SettlementListSerializer(many=True)
    },
)
class SettlementListView(generics.ListAPIView):
    serializer_class = SettlementListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Settlement.objects.filter(
                purchase_order__company=self.request.user.company
            )
            .select_related(
                "purchase_order",
                "supplier",
            )
            .order_by("-created_at")
        )
    


@extend_schema(
    tags=["Settlements"],
    summary="Settlement Details",
    description="Retrieve a settlement by ID.",
    responses={
        200: SettlementDetailSerializer,
    },
)
class SettlementDetailView(generics.RetrieveAPIView):
    serializer_class = SettlementDetailSerializer
    permission_classes = [IsAuthenticated]

    lookup_field = "id"

    def get_queryset(self):
        return Settlement.objects.filter(
            purchase_order__company=self.request.user.company
        ).select_related(
            "purchase_order",
            "supplier",
        )
    


@extend_schema(
    tags=["Settlement Processing"],
    summary="Process Settlement",
    description="""
Initiates payment from the company's wallet to the supplier.

Possible outcomes:

- SUCCESS
- PROCESSING
- FAILED

If OTP is enabled on the merchant account,
Monnify returns PENDING_AUTHORIZATION.
""",
    responses={
        200: SettlementProcessResponseSerializer,
        400: OpenApiResponse(description="Unable to process settlement."),
        401: OpenApiResponse(description="Unauthorized."),
        404: OpenApiResponse(description="Settlement not found."),
    },
)
class ProcessSettlementView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        settlement = get_object_or_404(
            Settlement,
            id=id,
            purchase_order__company=request.user.company,
        )

        settlement = process_settlement(settlement)

        return Response(
            SettlementProcessResponseSerializer(
                settlement
            ).data
        )
    

@extend_schema(
    tags=["Settlement Processing"],
    summary="Authorize Transfer OTP",
    description="""
Authorize a transfer using the OTP sent by Monnify.

Only required if merchant MFA is enabled.
""",
    request=OTPAuthorizationSerializer,
    responses={
        200: OpenApiResponse(
            description="OTP verified."
        ),
    },
)
class AuthorizeTransferView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = OTPAuthorizationSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        result = authorize_transfer_otp(
            reference=serializer.validated_data[
                "reference"
            ],
            otp=serializer.validated_data[
                "otp"
            ],
        )

        return Response(result)


@extend_schema(
    tags=["Settlement Processing"],
    summary="Transfer Status",
    description="""
Fetches the latest transfer status directly from Monnify.

Useful when transfers are asynchronous.
""",
    responses={
        200: TransferStatusSerializer,
    },
)
class SettlementTransferStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        settlement = get_object_or_404(
            Settlement,
            id=id,
            purchase_order__company=request.user.company,
        )

        data = get_transfer_status(settlement)

        return Response(data)


@extend_schema(
    tags=["Bank Verification"],
    summary="List Supported Banks",
    description="""
Returns all Nigerian banks supported by Monnify.

Use this endpoint to populate the bank dropdown
when onboarding a supplier.
""",
    responses={
        200: BankSerializer(many=True),
    },
)
class BankListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        banks = get_banks()

        serializer = BankSerializer(
            banks,
            many=True,
        )

        return Response(serializer.data)
    

@extend_schema(
    tags=["Bank Verification"],
    summary="Verify Supplier Bank Account",
    description="""
Verifies a supplier's payout account using Monnify.

If verification succeeds, the supplier's payout
bank details are automatically saved.

This account will later be used when processing
settlements.
""",
    request=SupplierBankAccountSerializer,
    responses={
        200: VerifiedBankAccountSerializer,
        400: OpenApiResponse(
            description="Validation Error",
        ),
        404: OpenApiResponse(
            description="Supplier not found",
        ),
    },
)
class SupplierBankAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        supplier = get_object_or_404(
            Supplier,
            id=id,
            company=request.user.company,
        )

        serializer = SupplierBankAccountSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        account = verify_bank_account(
            bank_code=serializer.validated_data["bank_code"],
            account_number=serializer.validated_data["account_number"],
            
        )
        account["bank_name"] = serializer.validated_data["bank_name"]

        supplier.bank_code = account["bank_code"]
        supplier.account_number = account["account_number"]
        supplier.account_name = account["account_name"]
        

        supplier.save(
            update_fields=[
                "bank_code",
                "bank_name",
                "account_number",
                "account_name",
            ]
        )

        return Response(
            VerifiedBankAccountSerializer(account).data
        )