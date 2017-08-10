import datetime
from django.test import TestCase
from django.contrib.auth.models import User

from .models import ClientProfile, BusinessProfile

class ClientProfileTests(TestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='test@test.com', password='123456789'
        )
        
        self.profile = ClientProfile.objects.create(
            user=self.user, name='testuser', tel_number='8(919)1991234', 
            car_model='ford mondeo 3', car_reg_number='a604 HK 89'
        )
    
    def test_ClientProfile_was_created(self):
     
        self.assertIs(self.user==User.objects.get(username='test@test.com'), True)
        self.assertIs(ClientProfile.objects.get(user=self.user).tel_number=='8(919)1991234', True)
        
        
class BusinessProfileTests(TestCase):
    
    def setUp(self):
        
        self.user = User.objects.create_user(
            username='owner@test.com', password='123456789'
        )
        self.profile = BusinessProfile.objects.create(
            user=self.user, name='owneruser', tel_number='8(919)1991'
        )
    
    def test_BusinessProfile_was_created(self):
        
        
        
        self.assertIs(self.user==User.objects.get(username='owner@test.com'), True)
        self.assertIs(BusinessProfile.objects.get(user=self.user).tel_number=='8(919)1991', True)
