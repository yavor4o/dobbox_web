from django.contrib.auth.forms import UserChangeForm

from dobbox_web.authentication.models import UserData


class DobboxUserUpdateForm(UserChangeForm):
    class Meta:
        model = UserData
        fields = ['profile_image', 'full_name', 'phone']

    def __init__(self, *args, **kwargs):
        super(DobboxUserUpdateForm, self).__init__(*args, **kwargs)

        # Задаване на класове и други атрибути на всички полета
        for field_name, field in self.fields.items():
            field.widget.attrs['class'] = 'form-control form-control-lg form-control-solid mb-3 mb-lg-0'
            field.widget.attrs['placeholder'] = field.label
