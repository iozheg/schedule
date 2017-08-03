from django.test import TestCase
from django.contrib.auth.models import User

from .models import ClientProfile

class ClientProfileTests(TestCase):
    
    def test_ClientProfile_was_created(self):
        
        user = User.objects.create(username='test@test.com', password='123456789')
        profile = ClientProfile.objects.create(user=user, name='testuser', tel_number='8(919)1991234', car_model='ford mondeo 3', car_reg_number='a604 HK 89')
        
        self.assertIs(user==User.objects.get(username='test@test.com'), True)
        self.assertIs(ClientProfile.objects.get(user=user).tel_number=='8(919)1991234', True)
