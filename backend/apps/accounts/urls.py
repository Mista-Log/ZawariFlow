from django.urls import path

from .views import SignupView, UpdateProfileView
from .views import SigninView

urlpatterns = [
    path(
        "signup/",
        SignupView.as_view(),
        name="signup",
    ),
    path(
        "signin/",
        SigninView.as_view(),
        name="signin",
    ),
    path(
        "profile/",
        UpdateProfileView.as_view(),
        name="update-profile",
    ),]