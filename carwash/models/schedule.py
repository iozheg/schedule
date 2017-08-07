import datetime
from django.db import models
from django import forms

from .user import BusinessProfile

class Schedule(models.Model):
    """Schedule model
    
    name - short name for schedule.
    
    description - schedule's description: wash type, services, features, etc.
    
    tel_number - can contain more than one number. By default, contains number 
    from BusinessProfile.
    
    address - address of car wash.
    
    working_days - week days. Use bitmask: 1 - monday, 2 - Tuesday, 4 - Wednesday
    8 - Thursday, 16 - Friday, 32 - Saturday, 64 - Sunday. Combaining them we
    get total working days.
    
    work_time_start, work_time_end - defines working hours of car wash.
    If work_time_start == work_time_end or blank than around the clock.
    
    dinner_break_start, dinner_break_ens - defines dinner time. 
    If one of them is blank, then no dinner.
    If one of them is blank, then no dinner.
    
    time_interval - defines time between two washes. For example, one car
    can be washed in 15 minutes.
    
    checkin_amount - defines how many cars can be wash in same time.
    
    active - schedule can be turned off.
    
    """
    
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=300)
    tel_number = models.CharField(max_length=30)
    address = models.CharField(max_length=100)
    
    work_days = models.SmallIntegerField()
    work_time_start = models.TimeField(blank=True)
    work_time_end = models.TimeField(blank=True)
    
    dinner_break_start = models.TimeField(blank=True)
    dinner_break_end = models.TimeField(blank=True)
    
    time_interval = models.TimeField(default=datetime.time(0, 15))
    checkin_amount = models.SmallIntegerField(default=1)
    
    active = models.BooleanField(default=True)
    create_date = models.DateField(auto_now_add=True)
    
    owner = models.ForeignKey(BusinessProfile, null=True, on_delete=models.SET_NULL)

class ScheduleCreateForm(forms.Form):
    
    name = forms.CharField(max_length=100)
    description = forms.CharField(max_length=300, widget=forms.Textarea)
    tel_number = forms.CharField(label='Telephone', max_length=30)
    address = forms.CharField(max_length=100)
    
    work_days = forms.IntegerField(initial=128, widget=forms.NumberInput)
    work_time_start = forms.TimeField(required=False)
    work_time_end = forms.TimeField(required=False)
    
    dinner_break_start = forms.TimeField(required=False)
    dinner_break_end = forms.TimeField(required=False)
    
    time_interval = forms.TimeField(initial=datetime.time(0, 15))
    checkin_amount = forms.IntegerField(initial=1, widget=forms.NumberInput)
    
    active = forms.BooleanField(initial=True)

    def save(self, user):
        self.cleaned_data['owner'] = user
        new_schedule = Schedule.objects.create(**self.cleaned_data)

class ScheduleDetailsForm(forms.Form):
    name = forms.CharField(max_length=100)
    description = forms.CharField(max_length=300, widget=forms.Textarea)
    tel_number = forms.CharField(label='Telephone', max_length=30)
    address = forms.CharField(max_length=100)
    
    work_days = forms.IntegerField(initial=128, widget=forms.NumberInput)
    work_time_start = forms.TimeField(required=False)
    work_time_end = forms.TimeField(required=False)
    
    dinner_break_start = forms.TimeField(required=False)
    dinner_break_end = forms.TimeField(required=False)
    
    time_interval = forms.TimeField(initial=datetime.time(0, 15))
    checkin_amount = forms.IntegerField(initial=1, widget=forms.NumberInput)
    
    active = forms.BooleanField(initial=True)

    def save(self, schedule_id):
     #   self.cleaned_data['id'] = schedule_id
        schedule = Schedule.objects.update_or_create(pk=schedule_id, defaults=self.cleaned_data)
