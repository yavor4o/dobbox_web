from import_export import resources

from dobbox_web.contragents.models import Contragent


class ContragentResource(resources.ModelResource):
    class Meta:
        model = Contragent
        import_id_fields = ('id',)
        skip_unchanged = True
        report_skipped = True
        fields = ('name', 'company', 'address', 'city', 'attention', 'telephone', 'email', 'region', 'gps_long',
                  'gps_lat', 'dealer', 'seasonal', 'cust_class', 'cust_sub_class', 'obj_type', 'customer_type',
                  'market_type', 'chain', 'supplier', 'blocked', 'distributor_code')
