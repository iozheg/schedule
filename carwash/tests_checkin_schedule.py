import datetime
from django.test import TestCase
from django.contrib.auth.models import User

from .models import ClientProfile, BusinessProfile, Schedule, Checkin

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
            'name': 'first', 
            'description': 'this is first', 
            'tel_number': '89198181111', 
            'address': 'Tyumen, respubliki 169',
            'work_days': 127,   
            'work_time_start': datetime.time(8, 0), 
            'work_time_end': datetime.time(22, 0),              
            'dinner_break_start': datetime.time(12, 0), 
            'dinner_break_end': datetime.time(13, 0),           
            'time_interval': datetime.time(0, 10), 
            'checkin_amount': 1,  
            'active': True, 
            'owner': BusinessProfile.objects.get(user=self.user)
        }

        self.sch1 = Schedule.objects.create(**initial_data_1)
        
        self.sch2 = Schedule.objects.create(**{
            'name': 'second', 'description': 'second one', 
            'tel_number': '(919)5jg9875', 'address': 'hg374g73h4987', 
            'work_days': 127, 'work_time_start': datetime.time(0, 0), 
            'work_time_end': datetime.time(0, 0), 
            'dinner_break_start': None, 'dinner_break_end': None, 
            'checkin_amount': 1, 'time_interval': datetime.time(0, 15),
            'active': True, 
            'owner': BusinessProfile.objects.get(user=self.user)
        })
        
        self.sch3 = Schedule.objects.create(**{
            'name': 'third', 'description': 'third one', 
            'tel_number': '34-58-77', 'address': 'Moscow', 
            'work_days': 63, 'work_time_start': datetime.time(0, 0), 
            'work_time_end': datetime.time(0, 0), 
            'dinner_break_start': datetime.time(12, 0), 
            'dinner_break_end': datetime.time(14, 0), 
            'checkin_amount': 2, 'time_interval': datetime.time(0, 30),
            'active': True, 
            'owner': BusinessProfile.objects.get(user=self.user)
        })
        
        self.ch = Checkin.objects.create(
            date=datetime.date(2017,8,9), time=datetime.time(8,0),
            schedule=self.sch1, client=self.user2.profile
        )        
    
    def test_Schedule_was_created(self):
        
        self.assertIs(Schedule.objects.get(name='first').description == 'this is first',True)
        self.assertIs(Schedule.objects.get(name='first').work_time_start == datetime.time(8,0,0),True)
        self.assertIs(Schedule.objects.get(name='second').owner == BusinessProfile.objects.get(user=self.user),True)
        self.assertIs(Schedule.objects.get(name='second').address == 'hg374g73h4987',True)
        
    def test_Schedule_DoesNotExist(self):
        
        with self.assertRaisesMessage(Schedule.DoesNotExist, ''):
            Schedule.objects.get(pk=5)

    def test_Checkin_was_created(self):
        
        self.assertIs(Checkin.objects.get(client=self.user2.profile) == self.ch, True)
        
    def test_Checkin_DoesNotExist(self):
        
        with self.assertRaisesMessage(Checkin.DoesNotExist, ''):
            Checkin.objects.get(pk=500)
            
    def test_Checkin_Schedule_relation(self):
        
        self.assertIs(Checkin.objects.get(client=self.user2.profile).schedule==self.sch1, True)
        
        with self.assertRaisesMessage(Schedule.DoesNotExist, ''):
            Checkin.objects.get(schedule=Schedule.objects.get(pk=50))
            
    def test_checkin_amount(self):
        
        for i in range(3):
            Checkin.objects.create(
                date=datetime.date(2017,8,10), time=datetime.time(8,35),
                schedule=self.sch1, client=self.user2.profile
            )
        
        for i in range(2):
            Checkin.objects.create(
                date=datetime.date(2017,8,11), time=datetime.time(8,27),
                schedule=self.sch2, client=self.user2.profile
            )
        
        Checkin.objects.create(
            date=datetime.date(2017,8,11), time=datetime.time(10,15),
            schedule=self.sch2, client=self.user2.profile
        )
        
        Checkin.objects.create(
            date=datetime.date(2017,8,11), time=datetime.time(10,15),
            schedule=self.sch3, client=self.user2.profile
        )
        
        #sch1
        self.assertIs(
            Checkin.objects.get_checkin_amount_by_datetime(
                self.sch1.id,
                datetime.date(2017,8,10),
                datetime.time(8,35)
            ),
            3
        )        
        self.assertIs(
            Checkin.objects.get_checkin_amount_by_datetime(
                self.sch1.id,
                datetime.date(2017,9,10),
                datetime.time(8,35)
            ),
            0
        )
        
        #sch2
        self.assertIs(
            Checkin.objects.get_checkin_amount_by_datetime(
                self.sch2.id,
                datetime.date(2017,8,11),
                datetime.time(8,27)
            ),
            2
        )       
        self.assertIs(
            Checkin.objects.get_checkin_amount_by_datetime(
                self.sch2.id,
                datetime.date(2017,9,10),
                datetime.time(8,27)
            ),
            0
        ) 
        self.assertIs(
            Checkin.objects.get_checkin_amount_by_datetime(
                self.sch2.id,
                datetime.date(2017,8,11),
                datetime.time(10,15)
            ),
            1
        )
        
        #sch3        
        self.assertIs(
            Checkin.objects.get_checkin_amount_by_datetime(
                self.sch3.id,
                datetime.date(2017,8,11),
                datetime.time(10,15)
            ),
            1
        )       
        self.assertIs(
            Checkin.objects.get_checkin_amount_by_datetime(
                self.sch3.id,
                datetime.date(2017,9,10),
                datetime.time(8,27)
            ),
            0
        ) 
        
    def test_add_checkin(self):
        
        self.assertTrue(
            isinstance(Checkin.objects.add_checkin(
                date=datetime.date(2017,8,10), time=datetime.time(8,35),
                schedule=self.sch1, client=self.user2.profile
            ), Checkin)
        )        
        self.assertIs(
            Checkin.objects.add_checkin(
                date=datetime.date(2017,8,10), time=datetime.time(8,35),
                schedule=self.sch1, client=self.user2.profile
            ),
            False
        )
        
        self.assertTrue(
            isinstance(Checkin.objects.add_checkin(
                date=datetime.date(2017,8,11), time=datetime.time(8,27),
                schedule=self.sch2, client=self.user2.profile
            ), Checkin)            
        )        
        self.assertIs(
            Checkin.objects.add_checkin(
                date=datetime.date(2017,8,11), time=datetime.time(8,27),
                schedule=self.sch2, client=self.user2.profile
            ),
            False            
        )
        
        self.assertTrue(
            isinstance(Checkin.objects.add_checkin(
                date=datetime.date(2017,7,10), time=datetime.time(8,35),
                schedule=self.sch1, client=self.user2.profile
            ), Checkin)
        )
        
        self.assertTrue(
            isinstance(Checkin.objects.add_checkin(
                date=datetime.date(2017,7,11), time=datetime.time(8,27),
                schedule=self.sch2, client=self.user2.profile
            ), Checkin)
        )
        
        for i in range(2):
            self.assertTrue(
                isinstance(Checkin.objects.add_checkin(
                    date=datetime.date(2017,8,11), time=datetime.time(8,27),
                    schedule=self.sch3, client=self.user2.profile
                ), Checkin)
            )
            
        self.assertIs(
            Checkin.objects.add_checkin(
                date=datetime.date(2017,8,11), time=datetime.time(8,27),
                schedule=self.sch3, client=self.user2.profile
            ),
            False            
        )

    def test_available_time_list(self):
        
        Checkin.objects.create(
            date=datetime.date(2017,8,10), time=datetime.time(8,30),
            schedule=self.sch1, client=self.user2.profile
        )
        
        Checkin.objects.create(
            date=datetime.date(2017,8,11), time=datetime.time(10,45),
            schedule=self.sch2, client=self.user2.profile
        )
        
        Checkin.objects.create(
            date=datetime.date(2017,8,11), time=datetime.time(19,15),
            schedule=self.sch2, client=self.user2.profile
        )
        
        Checkin.objects.create(
            date=datetime.date(2017,8,11), time=datetime.time(10,30),
            schedule=self.sch3, client=self.user2.profile
        )
        
        # This time is available
        self.assertTrue(
            "08:00:00" in self.sch1.get_available_time_for_checkin("2017-08-10")
        )
        self.assertTrue(
            "08:30:00" in self.sch1.get_available_time_for_checkin("2017-08-11")
        )
        # This time is unavailable because of checkin
        self.assertFalse(
            "08:30:00" in self.sch1.get_available_time_for_checkin("2017-08-10")
        )
        # This time is unavailable because it's non-working time
        self.assertFalse(
            "07:00:00" in self.sch1.get_available_time_for_checkin("2017-08-10")
        )

        # This time is available
        self.assertTrue(
            "00:00:00" in self.sch2.get_available_time_for_checkin("2017-08-11")
        )
        # This time is unavailable because of checkin
        self.assertFalse(
            "10:45:00" in self.sch2.get_available_time_for_checkin("2017-08-11")
        )
        self.assertFalse(
            "19:15:00" in self.sch2.get_available_time_for_checkin("2017-08-11")
        )
        
        # This time is available
        self.assertTrue(
            "02:00:00" in self.sch3.get_available_time_for_checkin("2017-08-11")
        )
        # This time is available because of checkin_amount = 2
        self.assertTrue(
            "10:30:00" in self.sch3.get_available_time_for_checkin("2017-08-11")
        )
        # This date is non-working day
        self.assertEqual(
            self.sch3.get_available_time_for_checkin("2017-08-20"), 
            "Non-working day"
        )
