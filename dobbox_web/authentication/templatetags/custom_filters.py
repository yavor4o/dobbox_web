# custom_filters.py
from django import template

register = template.Library()


@register.filter(name='split')
def split_string(value, key):
    """
    Returns the value turned into a list separated by the key.
    """
    return value.split(key)
