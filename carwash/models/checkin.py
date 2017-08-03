from django.db import models
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
