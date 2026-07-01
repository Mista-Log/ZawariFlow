from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from apps.companies.models import Company
from .models import User, UserRole



class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    class Meta:
        model = User

        fields = (
            "first_name",
            "last_name",
            "email",
            "password",
        )

    def create(self, validated_data):
        password = validated_data.pop("password")

        return User.objects.create_user(
            password=password,
            **validated_data,
        )



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "first_name",
            "last_name",
            "email",
            "company",
            "role",
            "profile_completed",
        )



class SigninSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(
            email=attrs["email"],
            password=attrs["password"],
        )

        if user is None:
            raise serializers.ValidationError(
                "Invalid email or password."
            )

        refresh = RefreshToken.for_user(user)

        return {
            "user": UserSerializer(user).data,   
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
    



class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "first_name",
            "last_name",
            "email",
            "role",
            "company",
            "phone_number",
            "profile_completed",
        )


class UpdateProfileResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
    data = UserProfileSerializer()


class UpdateProfileSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(required=False)
    registration_number = serializers.CharField(required=False)
    tax_identification_number = serializers.CharField(required=False)
    industry = serializers.CharField(required=False)
    country = serializers.CharField(required=False)
    address = serializers.CharField(required=False)
    phone_number = serializers.CharField(required=False)
    website = serializers.URLField(required=False)

    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "role",
            "company_name",
            "registration_number",
            "tax_identification_number",
            "industry",
            "country",
            "address",
            "phone_number",
            "website",
        )
    def validate(self, attrs):
        role = attrs.get("role")

        if role == UserRole.OWNER:
            required_fields = [
                "company_name",
                "registration_number",
                "industry",
                "country",
                "address",
                "phone_number",
            ]

            errors = {}

            for field in required_fields:
                if not attrs.get(field):
                    errors[field] = "This field is required."

            if errors:
                raise serializers.ValidationError(errors)

        return attrs
    
    def update(self, instance, validated_data):
        role = validated_data.pop("role")

        instance.first_name = validated_data.get(
            "first_name",
            instance.first_name,
        )

        instance.last_name = validated_data.get(
            "last_name",
            instance.last_name,
        )

        instance.role = role

        if role == UserRole.OWNER:
            company = Company.objects.create(
                name=validated_data.pop("company_name"),
                registration_number=validated_data.pop("registration_number"),
                tax_identification_number=validated_data.pop(
                    "tax_identification_number",
                    "",
                ),
                industry=validated_data.pop("industry"),
                country=validated_data.pop("country"),
                address=validated_data.pop("address"),
                phone_number=validated_data.pop("phone_number"),
                website=validated_data.pop("website", ""),
                owner=instance,
            )

            instance.company = company

        instance.profile_completed = True
        instance.save()

        return instance