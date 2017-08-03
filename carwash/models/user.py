from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class ClientProfile(models.Model):
    """Model for common client
    
    Required fields: tel_number
    car_model and car_reg_number can be empty
    
    """
    
    user = models.OneToOneField(User, related_name='profile', on_delete=models.CASCADE)
    name = models.CharField(max_length=50, blank=True)
    tel_number = models.CharField(max_length=15)
    car_model = models.CharField(max_length=40, blank=True)
    car_reg_number = models.CharField(max_length=10, blank=True)
    create_date = models.DateField(auto_now_add=True)
    
    
class BusinessProfile(models.Model):
    """Model for car wash owners
    
    Required fields: tel_number
    
    """
    
    user = models.OneToOneField(User, related_name='bis_profile', on_delete=models.CASCADE)
    name = models.CharField(max_length=50, blank=True)
    tel_number = models.CharField(max_length=15)
    create_date = models.DateField(auto_now_add=True)


#@receiver(post_save, sender=User)
#def create_and_update_profile(sender, instance, created, **kwargs):
    #if created:
        #ClientProfile.objects.create(user=instance, car_model=kwargs)
