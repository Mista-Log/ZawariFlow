from drf_spectacular.utils import (
    extend_schema,
    OpenApiResponse,
)

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .services import get_dashboard_overview
from .serializers import DashboardOverviewSerializer


@extend_schema(
    tags=["Dashboard"],
    summary="Dashboard Overview",
    description=(
        "Returns all information required to power the dashboard overview "
        "including summary statistics, settlement volume chart, split "
        "breakdown by supplier category, and recent activity."
    ),
    responses={
        200: OpenApiResponse(
            response=DashboardOverviewSerializer,
            description="Dashboard overview retrieved successfully.",
        ),
        401: OpenApiResponse(
            description="Authentication credentials were not provided.",
        ),
    },
)
class DashboardOverviewAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company = request.user.company

        data = get_dashboard_overview(company)

        serializer = DashboardOverviewSerializer(data)

        return Response(serializer.data)