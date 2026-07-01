from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import (
    OpenApiExample,
    OpenApiResponse,
    extend_schema,
)
from .serializers import SignupSerializer
from .serializers import SigninSerializer

from rest_framework.permissions import IsAuthenticated

from .serializers import (
    UpdateProfileSerializer,
    UserProfileSerializer,
    UpdateProfileResponseSerializer,
)


@extend_schema(
    tags=["Authentication"],
    summary="Create a new account",
    description="""
Register a new user account.

- Email must be unique.
- Company is optional.
- Password must satisfy Django's password validators.
""",
    request=SignupSerializer,
    responses={
        201: OpenApiResponse(
            description="Account created successfully."
        ),
        400: OpenApiResponse(
            description="Validation error."
        ),
    },
)
class SignupView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        return Response(
            {
                "message": "Account created successfully.",
                "email": user.email,
            },
            status=status.HTTP_201_CREATED,
        )


@extend_schema(
    tags=["Authentication"],
    summary="Sign in",
    description="""
Authenticate a user using email and password.

Returns JWT access and refresh tokens.
""",
    request=SigninSerializer,
    responses={
        200: OpenApiResponse(
            description="Login successful."
        ),
        400: OpenApiResponse(
            description="Invalid credentials."
        ),
    },
)
class SigninView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = SigninSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.validated_data)
    



class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["Authentication"],
        summary="Complete or update profile",
        description=(
            "Update the authenticated user's profile and choose a business role."
        ),
        request=UpdateProfileSerializer,
        responses={
            200: UpdateProfileResponseSerializer,
            400: OpenApiResponse(description="Validation error"),
            401: OpenApiResponse(description="Unauthorized"),
        },
        examples=[
            OpenApiExample(
                "Owner",
                request_only=True,
                value={
                    "first_name": "Ibrahim",
                    "last_name": "Oloyede",
                    "company": "ATC Africa",
                    "role": "OWNER",
                },
            ),
        ],
    )
    def patch(self, request):
        serializer = UpdateProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        return Response(
            {
                "message": "Profile updated successfully.",
                "data": UserProfileSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )