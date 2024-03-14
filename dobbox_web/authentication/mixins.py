from django.contrib import admin
from django.core.exceptions import ImproperlyConfigured

class ImportExportPermissionMixin:
    def get_model_info(self):
        if hasattr(self, 'model'):
            model = self.model
            app_label = model._meta.app_label
            model_name = model._meta.model_name
            return app_label, model_name
        else:
            raise ImproperlyConfigured("ImportExportPermissionMixin requires to be used with a ModelAdmin")

    def has_import_permission(self, request):
        app_label, model_name = self.get_model_info()
        codename = f'{app_label}.can_import'
        return request.user.has_perm(codename)

    def has_export_permission(self, request):
        app_label, model_name = self.get_model_info()
        codename = f'{app_label}.can_export'
        return request.user.has_perm(codename)
