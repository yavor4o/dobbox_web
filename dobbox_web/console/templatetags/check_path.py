from django import template
from django.urls import reverse

register = template.Library()


@register.simple_tag(takes_context=True)
def is_current_path(context, name):
    try:
        path = reverse(name)
    except:
        path = name
    return context['request'].path == path
