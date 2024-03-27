from django.db.models.signals import post_delete
from django.dispatch import receiver

from dobbox_web.transport.models import TransportRequestAssets


@receiver(post_delete, sender=TransportRequestAssets)
def delete_request_if_last_asset(sender, instance, **kwargs):
    transport_request = instance.transport_request
    if not transport_request.assets.exists():
        transport_request.delete()
