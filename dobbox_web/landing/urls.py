from django import views
from django.urls import path

from dobbox_web.landing.views import LandingView, UserHomeView, UserAccountView, UserUpdateAccountView, UpdateEmailView, \
    CustomPasswordChangeView, deactivate_and_anonymize_user

urlpatterns = [
    path('', LandingView.as_view(), name='landing'),
    path('user-home/', UserHomeView.as_view(), name='user-home'),
    path('user-account/', UserAccountView.as_view(), name='user-account'),
    path('user-account/settings/', UserUpdateAccountView.as_view(), name='user-account-settings'),
    path('update-email/', UpdateEmailView.as_view(), name='update_email'),
    path('change-password/', CustomPasswordChangeView.as_view(), name='change_password'),
    path('validate-password-and-deactivate/', deactivate_and_anonymize_user,
         name='validate_password_and_deactivate'),
]