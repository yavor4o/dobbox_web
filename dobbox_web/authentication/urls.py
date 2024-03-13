from django.urls import path

from dobbox_web.authentication.views import LoginUserView, logout_user, ResetPasswordView, ResetPasswordConfirmView

urlpatterns = [

    path('login/', LoginUserView.as_view(), name='login'),
    path('logout/', logout_user, name='logout'),
    path('password_reset/', ResetPasswordView.as_view(), name='password_reset'),
    path('password_reset_confirm/<uidb64>/<token>/', ResetPasswordConfirmView.as_view(), name='password_reset_confirm'),

]