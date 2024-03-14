import form
from django import forms
from django.contrib.auth import get_user_model, password_validation
from django.contrib.auth.forms import UserCreationForm, UserChangeForm, AuthenticationForm, PasswordChangeForm, \
    SetPasswordForm, PasswordResetForm
from django.shortcuts import redirect

from .models import DobboxUser, UserData

UserModel = get_user_model()



class DobboxAuthenticationForm(AuthenticationForm):
    username = forms.EmailField(widget=forms.TextInput(attrs={'class': 'form-control bg-transparent', 'placeholder': 'Email', 'autocomplete': 'off'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control bg-transparent', 'placeholder': 'Парола', 'autocomplete': 'off'}))

    def __init__(self, *args, **kwargs):
        super(DobboxAuthenticationForm, self).__init__(*args, **kwargs)
        self.fields['username'].label = 'Email'


class DobboxUserCreationForm(UserCreationForm):
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={'class': 'form-control bg-transparent', 'placeholder': 'Имейл',
                                       'required': 'required'}),
        label="Имейл"
    )
    password1 = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control bg-transparent', 'placeholder': 'Нова Парола',
                                          'required': 'required'}),
        label="Нова парола"
    )
    password2 = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control bg-transparent', 'placeholder': 'Повторете Паролата',
                                          'required': 'required'}),
        label="Повторете паролата"
    )

    class Meta:
        model = UserModel
        fields = ('email', 'password1', 'password2',)




class DobboxUserChangeForm(UserChangeForm):
    class Meta:
        model = UserModel
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(DobboxUserChangeForm, self).__init__(*args, **kwargs)
        self.fields['manager'].queryset = DobboxUser.objects.filter(is_staff=True)


class WelcomeUserDataForm(forms.ModelForm):
    full_name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control bg-transparent', 'placeholder': 'Пълно име'}))
    region = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control bg-transparent', 'placeholder': 'Регион'}))
    # Добавяне на поле за избор на мениджър
    manager = forms.ModelChoiceField(
        queryset=DobboxUser.objects.filter(is_staff=True),
        required=True,
        widget=forms.Select(attrs={'class': 'form-control bg-transparent'}),
        label="Мениджър",
        empty_label="Изберете мениджър",  # Текст за опцията по подразбиране
    )

    class Meta:
        model = UserData
        fields = ['full_name', 'region']  # Премахнат е 'manager' от тук

    def save(self, commit=True):
        instance = super(WelcomeUserDataForm, self).save(commit=False)
        if commit:
            instance.save()
            self.save_m2m()  # Запазва many-to-many данните, ако има такива
        if 'manager' in self.cleaned_data and self.cleaned_data['manager'] is not None:
            instance.user.manager = self.cleaned_data['manager']
            instance.user.save()
        return instance




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

        user = self.user
        password_validation.validate_password(password2, user)

        return password2


class SendPasswordResetForm(PasswordResetForm):
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={'class': 'form-control bg-transparent','placeholder': 'Email',
                                       'autocomplete': 'off'}),


    )

