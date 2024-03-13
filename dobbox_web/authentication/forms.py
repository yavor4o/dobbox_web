from django import forms
from django.contrib.auth import get_user_model, password_validation
from django.contrib.auth.forms import UserCreationForm, UserChangeForm, AuthenticationForm, PasswordChangeForm, \
    SetPasswordForm, PasswordResetForm
from .models import DobboxUser, UserData

UserModel = get_user_model()



class DobboxAuthenticationForm(AuthenticationForm):
    username = forms.EmailField(widget=forms.TextInput(attrs={'class': 'form-control bg-transparent', 'placeholder': 'Email', 'autocomplete': 'off'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control bg-transparent', 'placeholder': 'Парола', 'autocomplete': 'off'}))

    def __init__(self, *args, **kwargs):
        super(DobboxAuthenticationForm, self).__init__(*args, **kwargs)
        self.fields['username'].label = 'Email'


class DobboxUserCreationForm(UserCreationForm):
    class Meta:
        model = UserModel
        fields = ('email',)


class DobboxUserChangeForm(UserChangeForm):
    class Meta:
        model = UserModel
        fields = ('email',)  # Добавете или премахнете полета според вашите нужди


class UserDataForm(forms.ModelForm):
    class Meta:
        model = UserData
        fields = ['name', 'profile_image', 'region', 'gps_long', 'gps_lat']


class PasswordChangeCustomForm(SetPasswordForm):
    new_password1 = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control bg-transparent', 'placeholder': 'Нова Парола',
                                          'required': 'required'}),
        label="Нова парола"

    )
    new_password2 = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control bg-transparent', 'placeholder': 'Повторете Паролата',
                                          'required': 'required'}),
        label="Повторете паролата"
    )

    def clean_new_password2(self):
        password1 = self.cleaned_data.get("new_password1")
        password2 = self.cleaned_data.get("new_password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Паролите не съвпадат")

        user = self.user  # Уверете се, че сте задали 'self.user' във вашата форма
        password_validation.validate_password(password2, user)

        return password2


class SendPasswordResetForm(PasswordResetForm):
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={'class': 'form-control bg-transparent','placeholder': 'Email',
                                       'autocomplete': 'off'}),


    )

