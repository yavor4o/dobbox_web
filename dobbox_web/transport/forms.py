from django import forms
from django.contrib.admin.widgets import FilteredSelectMultiple
from django.core.exceptions import ValidationError

from .models import TransportCompanyRequest, TransportRequests


class TransportCompanyRequestForm(forms.ModelForm):
    transport_requests = forms.ModelMultipleChoiceField(
        queryset=TransportRequests.objects.all(),
        required=False,
        widget=FilteredSelectMultiple("Заявки за транспорт", is_stacked=False),
        label="Заявки за транспорт",
    )

    class Meta:
        model = TransportCompanyRequest
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(TransportCompanyRequestForm, self).__init__(*args, **kwargs)
        if self.instance.pk:
            self.fields['transport_requests'].initial = self.instance.transport_requests.all()
            assigned_requests = TransportRequests.objects.filter(
                assigned_transport_company_requests__isnull=False
            ).exclude(assigned_transport_company_requests=self.instance)
            self.fields['transport_requests'].queryset = TransportRequests.objects.exclude(id__in=assigned_requests)
        else:
            assigned_requests = TransportRequests.objects.filter(
                assigned_transport_company_requests__isnull=False
            )
            self.fields['transport_requests'].queryset = TransportRequests.objects.exclude(id__in=assigned_requests)

    def clean(self):
        cleaned_data = super().clean()
        transport_requests = cleaned_data.get('transport_requests')
        if not transport_requests.exists():
            raise ValidationError("Трябва да изберете поне една заявка за транспорт.")
        if not cleaned_data.get('transport_company'):
            raise ValidationError("Трябва да изберете транспортна компания.")

    def save(self, commit=True):
        instance = super().save(commit=False)
        if commit:
            instance.save()
            instance.transport_requests.set(self.cleaned_data['transport_requests'])
        return instance


class TransportRequestsForm(forms.ModelForm):
    assigned_transport_company_request_info = forms.CharField(label="Назначена заявка за транспорт", required=False,
                                                              disabled=True)

    class Meta:
        model = TransportRequests
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(TransportRequestsForm, self).__init__(*args, **kwargs)
        if self.instance.pk:
            assigned_requests = self.instance.assigned_transport_company_requests.all()
            if assigned_requests.exists():
                self.fields['assigned_transport_company_request_info'].initial = ', '.join(
                    [str(transport_company_request.id) for transport_company_request in assigned_requests])
            else:
                self.fields['assigned_transport_company_request_info'].initial = "Няма назначение"
