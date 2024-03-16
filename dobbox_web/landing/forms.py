from django.contrib.auth.forms import UserChangeForm
from django import forms
from dobbox_web.authentication.models import UserData, DobboxUser


class DobboxUserUpdateForm(UserChangeForm):
    class Meta:
        model = UserData
        fields = ['profile_image', 'full_name', 'phone']

    def __init__(self, *args, **kwargs):
        super(DobboxUserUpdateForm, self).__init__(*args, **kwargs)

        for field_name, field in self.fields.items():
            field.widget.attrs['class'] = 'form-control form-control-lg form-control-solid mb-3 mb-lg-0'
            field.widget.attrs['placeholder'] = field.label




class EmailUpdateForm(forms.ModelForm):
    confirmemailpassword = forms.CharField(widget=forms.PasswordInput())

    class Meta:
        model = DobboxUser
        fields = ['email']

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get("email")
        password = cleaned_data.get("confirmemailpassword")

        if not self.instance.check_password(password):
            self.add_error('confirmemailpassword', "Невалидна парола.")

        if DobboxUser.objects.exclude(pk=self.instance.pk).filter(email=email).exists():
            self.add_error('email', "Вече съществува потребител с такъв имейл.")

        return cleaned_data