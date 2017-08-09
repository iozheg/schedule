import datetime
from django.test import TestCase
from django.contrib.auth.models import User

from .models import ClientProfile, BusinessProfile, Schedule, Checkin

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


class ScheduleAndCheckinTests(TestCase):
    
    def setUp(self):
        
        self.user = User.objects.create_user(
            username='owner@test.com', password='123456789'
        )
        self.profile = BusinessProfile.objects.create(
            user=self.user, name='owneruser', tel_number='8(919)1991'
        )        
        
        self.user2 = User.objects.create_user(
            username='test@test.com', password='123456789'
        )
        
        self.profile = ClientProfile.objects.create(
            user=self.user2, name='testuser', tel_number='8(919)1991234', 
            car_model='ford mondeo 3', car_reg_number='a604 HK 89'
        )
        
        initial_data_1 = {
            'work_time_end': datetime.time(22, 0), 
            'checkin_amount': 1, 
            'dinner_break_end': datetime.time(13, 0), 
            'work_time_start': datetime.time(8, 0), 
            'work_days': 128, 
            'name': 'first', 
            'time_interval': datetime.time(0, 15), 
            'id': 1, 
            'description': 'this is first', 
            'tel_number': '89198181111', 
            'dinner_break_start': datetime.time(12, 0), 
            'address': 'Tyumen, respubliki 169', 
            'active': True, 
            'owner': BusinessProfile.objects.get(user=self.user)
        }

        self.sch = Schedule.objects.create(**initial_data_1)
        
        Schedule.objects.create(**{
            'work_time_end': datetime.time(0, 0), 'checkin_amount': 1, 
            'dinner_break_end': None, 'work_time_start': datetime.time(0, 0), 
            'work_days': 128, 'name': 'second', 
            'time_interval': datetime.time(0, 15), 'id': 2, 
            'description': 'second one', 'tel_number': '5jg9875', 
            'dinner_break_start': None, 'address': 'hg374g73h4987', 
            'active': True, 'owner': BusinessProfile.objects.get(user=self.user)
        })
        
        self.ch = Checkin.objects.create(
            date=datetime.date(2017,8,9),
            time=datetime.time(8,0),
            schedule=self.sch,
            client=self.user2.profile
        )
    
    def test_Schedule_was_created(self):
                 
        self.assertIs(Schedule.objects.get(pk=1).name == 'first',True)
        self.assertIs(Schedule.objects.get(pk=1).work_time_start == datetime.time(8,0,0),True)
        self.assertIs(Schedule.objects.get(pk=2).owner == BusinessProfile.objects.get(user=self.user),True)
        self.assertIs(Schedule.objects.get(pk=2).address == 'hg374g73h4987',True)
        
    def test_Schedule_DoesNotExist(self):
        
        with self.assertRaisesMessage(Schedule.DoesNotExist, ''):
            Schedule.objects.get(pk=5)

    def test_Checkin_was_created(self):
        
        self.assertIs(Checkin.objects.get(client=self.user2.profile) == self.ch, True)
        
    def test_Checkin_DoesNotExist(self):
        
        with self.assertRaisesMessage(Checkin.DoesNotExist, ''):
            Checkin.objects.get(pk=5)
            
        with self.assertRaisesMessage(Checkin.DoesNotExist, ''):
            Checkin.objects.get(schedule=Schedule.objects.get(pk=2))
            
    def test_Checkin_Schedule_relation(self):
        
        self.assertIs(Checkin.objects.get(client=self.user2.profile).schedule==self.sch, True)
        
        with self.assertRaisesMessage(Schedule.DoesNotExist, ''):
            Checkin.objects.get(schedule=Schedule.objects.get(pk=5))

