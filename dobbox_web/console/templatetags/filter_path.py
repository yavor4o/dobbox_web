from django import template

register = template.Library()

@register.filter(name='startswith')
def startswith_after_first_slash(text, starts):
    if isinstance(text, str) and starts:
        # Намира сегмента на URL след първия '/'
        path_after_first_slash = text.split('/', 1)[-1] if '/' in text else text
        # Проверява дали сегментът започва с някое от зададените начала
        return path_after_first_slash.startswith(starts)
    return False
