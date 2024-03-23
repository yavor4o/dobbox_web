# from django.db.models.signals import post_save
# from django.dispatch import receiver
#
# from dobbox_web.assets.models import Asset
# from dobbox_web.transport.models import TransportCompany, TransportPriceCompany
#
#
# @receiver(post_save, sender=TransportCompany)
# def create_price_for_each_asset_type(sender, instance, created, **kwargs):
#     if created:  # Ако се създава нова транспортна компания
#         asset_types = Asset.objects.values_list('asset_type', flat=True).distinct()
#         for asset_type in asset_types:
#             TransportPriceCompany.objects.create(
#                 transport_company=instance,
#                 asset_type=asset_type,
#                 price=0
#             )
