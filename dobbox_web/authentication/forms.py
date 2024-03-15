import form
from django import forms
from django.contrib.auth import get_user_model, password_validation, authenticate
from django.contrib.auth.forms import UserCreationForm, UserChangeForm, AuthenticationForm, PasswordChangeForm, \
    SetPasswordForm, PasswordResetForm
from django.contrib.auth.models import Group
from django.core.exceptions import ValidationError
from django.shortcuts import redirect
from django.utils.translation import gettext_lazy as _

from .models import DobboxUser, UserData
from ..nomenclatures.models import Regions, Office

UserModel = get_user_model()


class DobboxAuthenticationForm(AuthenticationForm):
    username = forms.EmailField(widget=forms.TextInput(
        attrs={'class': 'form-control bg-transparent', 'placeholder': 'Email', 'autocomplete': 'off'}))
    password = forms.CharField(widget=forms.PasswordInput(
        attrs={'class': 'form-control bg-transparent', 'placeholder': 'Парола', 'autocomplete': 'off'}))

    def get_invalid_login_error(self):
        email = self.cleaned_data.get(
            'username')
        user = UserModel.objects.filter(email=email).first()
        if user and not user.is_active:
            return ValidationError(
                _("Този акаунт все още не е потвърден."),
                code='inactive',
            )
        return super().get_invalid_login_error()


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


class ManagerChoiceField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
        try:
            user_data = UserData.objects.get(user=obj)
            if user_data.full_name:
                return user_data.full_name
            else:
                return obj.email
        except UserData.DoesNotExist:
            return obj.email


class DobboxUserChangeForm(UserChangeForm):
    manager = ManagerChoiceField(queryset=DobboxUser.objects.filter(is_staff=True))

    class Meta:
        model = UserModel
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(DobboxUserChangeForm, self).__init__(*args, **kwargs)


class WelcomeUserDataForm(forms.ModelForm):
    full_name = forms.CharField(
        widget=forms.TextInput(attrs={'class': 'form-control bg-transparent', 'placeholder': 'Пълно име'}))

    manager = ManagerChoiceField(
        queryset=DobboxUser.objects.filter(is_staff=True),
        required=True,
        widget=forms.Select(attrs={'class': 'form-control bg-transparent'}),
        label="Мениджър",
        empty_label="Изберете пряк ръководител"
    )

    regions = forms.ModelChoiceField(
        queryset=Regions.objects.all(),
        widget=forms.Select(attrs={'class': 'form-control bg-transparent'}),
        label="Регион",
        empty_label="Изберете регион"
    )

    provincial_city = forms.ModelChoiceField(
        queryset=Office.objects.filter(category='ОБЛ. ГРАД'),  # Първоначално празно, ще се попълва с JS
        widget=forms.Select(attrs={'class': 'form-control bg-transparent', 'id': 'id_provincial_city'}),
        label="Офис",
        empty_label="Изберете  офиса ви след избор на регион"
    )

    class Meta:
        model = UserData
        fields = ['full_name', 'regions', 'provincial_city',]

    def save(self, commit=True):
        instance = super(WelcomeUserDataForm, self).save(commit=False)

        if 'provincial_city' in self.cleaned_data and self.cleaned_data['provincial_city'] is not None:
            instance.office = self.cleaned_data['provincial_city']
        if commit:
            instance.save()

        if 'manager' in self.cleaned_data and self.cleaned_data['manager'] is not None:
            instance.user.manager = self.cleaned_data['manager']
            instance.user.save()

        sr_group, created = Group.objects.get_or_create(name='SR')
        instance.user.groups.add(sr_group)
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
        widget=forms.EmailInput(attrs={'class': 'form-control bg-transparent', 'placeholder': 'Email',
                                       'autocomplete': 'off'}),

    )
