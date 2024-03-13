
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('dobbox_web.landing.urls')),
    path('authentication/', include('dobbox_web.authentication.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
