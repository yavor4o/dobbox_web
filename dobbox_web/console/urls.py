from django.urls import path
from dobbox_web.console.views import ConsoleHomeView, ConsoleRView, ConsoleVView, ConsoleCView

app_name = 'console'

urlpatterns = [

    path('', ConsoleHomeView.as_view(), name='console home'),
    path('assets/transport-request/', ConsoleRView.as_view(), name='transport request'),
    path('asset/assets-transport/', ConsoleVView.as_view(), name='assets transport'),
    path('assets/assets-movements/',ConsoleCView.as_view(), name='assets movements'),
]