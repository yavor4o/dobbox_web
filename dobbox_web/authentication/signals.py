from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import DobboxUser, UserData


@receiver(post_save, sender=DobboxUser)
def create_user_data(sender, instance, created, **kwargs):
    if created:
        UserData.objects.create(user=instance)
