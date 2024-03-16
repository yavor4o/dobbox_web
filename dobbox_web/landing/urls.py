from django import views
from django.urls import path

from dobbox_web.landing.views import LandingView, UserHomeView, UserAccountView, UserUpdateAccountView

urlpatterns = [
    path('', LandingView.as_view(), name='landing'),
    path('user-home/', UserHomeView.as_view(), name='user-home'),
    path('user-account/', UserAccountView.as_view(), name='user-account'),
    path('user-account/settings/', UserUpdateAccountView.as_view(), name='user-account-settings'),
]