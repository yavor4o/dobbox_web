from django.urls import path
from dobbox_web.console.views import ConsoleHomeView, ConsoleTransportRequestView, ConsoleVView, ConsoleCView, \
    TransportRequestsDataView, TransportRequestAssetsDataView, GetTransportCompaniesView, \
    GetTransportRequestStatusesView, TransportRequestStatusHistoryView, DeleteTransportAssetView, \
    DeleteTransportRequestView, HandleTransportRequestView, TransportRouteDetailsView, GetTransportInfoView, \
    SetTransportRequest

app_name = 'console'

urlpatterns = [

    path('', ConsoleHomeView.as_view(), name='console home'),
    path('assets/transport-request/', ConsoleTransportRequestView.as_view(), name='transport request'),
    path('api/transport-requests/', TransportRequestsDataView.as_view(), name='api_transport_requests'),
    path('api/sub-asset-request/', TransportRequestAssetsDataView.as_view(), name='sub-asset-request'),
    path('api/get-transport-companies/', GetTransportCompaniesView.as_view(), name='get-transport-companies'),
    path('api/get-transport-request-statuses/', GetTransportRequestStatusesView.as_view(), name='get-transport-request-statuses'),
    path('api/get-request-history/<int:asset_id>/', TransportRequestStatusHistoryView.as_view(), name='get_request_history'),
    path('api/delete-asset/<int:asset_id>/', DeleteTransportAssetView.as_view(), name='delete_transport_asset_request'),
    path('api/delete-transport-request/<int:transport_request_id>/', DeleteTransportRequestView.as_view(), name='delete_transport_request'),
    path('api/handle-transport-request/<str:action>/<int:pk>/', HandleTransportRequestView.as_view(), name='handle_transport_request'),
    path('api/transport-details-view/', TransportRouteDetailsView.as_view(), name='get-object-coordinates'),
    path('api/get-transport-info/', GetTransportInfoView.as_view(), name='get-transport-info'),
    path('api/set-transport-request/', SetTransportRequest.as_view(), name='set-transport-request'),
    path('asset/assets-transport/', ConsoleVView.as_view(), name='assets transport'),
    path('assets/assets-movements/',ConsoleCView.as_view(), name='assets movements'),
]