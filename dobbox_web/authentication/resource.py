from import_export import resources
from .models import DobboxUser, Regions


from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget
from .models import DobboxUser, UserData
from ..nomenclatures.models import Office


class DobboxUserResource(resources.ModelResource):
    # Дефиниране на допълнителни полета от UserData, които искате да включите
    full_name = fields.Field(
        attribute='userdata__full_name',
        column_name='full name'
    )
    region_name = fields.Field(
        attribute='userdata__regions__name',
        column_name='region name'
    )



    class Meta:
        model = DobboxUser
        fields = ('id', 'email', 'is_active', 'is_staff', 'is_superuser', 'date_joined' , 'full_name', 'manager',
                  'region_name')





class RegionsResource(resources.ModelResource):
    class Meta:
        model = Regions


class CityResource(resources.ModelResource):
    region = fields.Field(
        column_name='Код на регион',
        attribute='region',
        widget=ForeignKeyWidget(Regions, 'code'))

    class Meta:
        model = Office
        skip_unchanged = True
        report_skipped = True
        import_id_fields = ('name',)
        fields = ('id', 'name', 'municipality_code', 'municipality_name', 'region', 'provincial_city', 'category',)