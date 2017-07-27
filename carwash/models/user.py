from django.db import models
from django.contrib.auth.models import User

class ClientProfile(models.Model):
    """Model for common client
    
    Required fields: tel_number
    car_model and car_reg_number can be empty
    
    """
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    tel_number = models.CharField(max_length=15)
    car_model = models.CharField(max_length=40, blank=True)
    car_reg_number = models.CharField(max_length=10, blank=True)
    create_date = models.DateField(auto_add_now=True)
    
    
class BusinessProfile(models.Model):
    """Model for car wash owners
    
    Required fields: tel_number
    
    """
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    tel_number = models.CharField(max_length=15)
    create_date = models.DateField(auto_add_now=True)
