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