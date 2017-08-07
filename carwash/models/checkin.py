from django.db import models
from django import forms

from .user import ClientProfile
from .schedule import Schedule

class Checkin(models.Model):
    """ Checkin model """
    
    date = models.DateField()
    time = models.TimeField()
    active = models.BooleanField(default=True)
    create_date = models.DateField(auto_now_add=True)

    client = models.ForeignKey(ClientProfile, null=True, on_delete=models.SET_NULL)
    schedule = models.ForeignKey(Schedule, null=True, on_delete=models.SET_NULL)


class CheckinCreateForm(forms.Form):
    
    date = forms.DateField()
    time = forms.TimeField()
    schedule = forms.IntegerField()
    
    def save(self, user):
        
        self.cleaned_data['client'] = user.profile
        self.cleaned_data['schedule'] = Schedule.objects.get(pk=self.cleaned_data['schedule'])
        
        checkin = Checkin.objects.create(**self.cleaned_data)
