from django import views
from django.urls import path

from dobbox_web.landing.views import LandingView

urlpatterns = [
    path('', LandingView.as_view(), name='landing'),
]