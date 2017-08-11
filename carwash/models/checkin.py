from django.db import models
from django import forms

from .user import ClientProfile
from .schedule import Schedule


class CheckinManager(models.Manager):
    
    def get_checkin_amount_by_datetime(self, schedule_id, date, time):
        
        checkin_amount = Checkin.objects.filter(
                            schedule=schedule_id, date=date, 
                            time=time
                        ).count()
        
        return checkin_amount
        
    def add_checkin(self, schedule, date, time, client):
        ''' Try add new checkin with date and time in schedule.
        
        Each schedule can have limited amount of checkins in same time
        and date. We check if we can add one more. If so than create new
        else return False
        '''
        
        amount = self.get_checkin_amount_by_datetime(
                            schedule.id, date, time
                        )
        
        #try:
            #schedule = Schedule.objects.get(id=schedule_id).checkin_amount
        #except Schedule.DoesNotExist:
            #return False
        
        if amount < schedule.checkin_amount:
            checkin = Checkin.objects.create(
                date=date, time=time, client=client, schedule=schedule
            )
            return checkin
        else:
            return False
        

class Checkin(models.Model):
    """ Checkin model """
    
    date = models.DateField()
    time = models.TimeField()
    active = models.BooleanField(default=True)
    create_date = models.DateField(auto_now_add=True)

    client = models.ForeignKey(ClientProfile, null=True, on_delete=models.SET_NULL)
    schedule = models.ForeignKey(Schedule, null=True, on_delete=models.SET_NULL)
    
    objects = CheckinManager()


class CheckinCreateForm(forms.Form):
    
    date = forms.DateField()
    time = forms.TimeField()
    schedule = forms.IntegerField()
    
    def clean_schedule(self):
        try:
            self.cleaned_data['schedule'] = Schedule.objects.get(pk=self.cleaned_data['schedule'])
            
        except Schedule.DoesNotExist:
            raise forms.ValidationError('No such schedule!', code='no-schedule')
        
        return self.cleaned_data['schedule']
    
    def save(self, user):
        
        self.cleaned_data['client'] = user.profile
                
        checkin = Checkin.objects.create(**self.cleaned_data)
        
        return checkin


class CheckinAmountForm(forms.Form):
    
    '''Form for testing'''
    
    
    date = forms.DateField()
    time = forms.TimeField()
    schedule = forms.IntegerField()
    
    def save(self):
        
        amount = Checkin.objects.get_checkin_amount_by_datetime(
            self.cleaned_data['schedule'], self.cleaned_data['date'],
            self.cleaned_data['time']
        )
    
        return amount
