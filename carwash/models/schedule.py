import datetime
from django.db import models
from django import forms

from .user import BusinessProfile

class ScheduleManager(models.Manager):
    
    def get_filtered_names(self, name_template):
        """Returns list with schedule names.
        
        Returned only names which start with name_template.

        """        
        schedules = Schedule.objects.filter(name__startswith=name_template)
        schedules_names = [s.name for s in schedules]

        return schedules_names

    def get_brief_info(self, name_template):
        """Returns list with brief info of schedules.

        Only schedules which names start with name_template are 
        selected.
        Returned info: 
            id, name, description, address, tel_number, work time

        """
        schedules = Schedule.objects.filter(name__startswith=name_template)
        schedules_info = [ 
            {
                'id': s.id, 
                'name': s.name, 
                'description': s.description,
                'address': s.address,
                'work_time_start': s.work_time_start,
                'work_time_end': s.work_time_end
            } for s in schedules 
        ]

        return schedules_info

class Schedule(models.Model):
    """Schedule model.
    
    name - short name for schedule.
    
    description - schedule's description: wash type, services, 
    features, etc.
    
    tel_number - can contain more than one number. By default, contains 
    number from BusinessProfile.
    
    address - address of car wash.
    
    working_days - week days. Use bitmask: 1 - monday, 2 - Tuesday, 
    4 - Wednesday 8 - Thursday, 16 - Friday, 32 - Saturday, 64 - Sunday. 
    Combaining them we get total working days.
    
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
    work_time_start = models.TimeField(blank=True, null=True)
    work_time_end = models.TimeField(blank=True, null=True)
    
    dinner_break_start = models.TimeField(blank=True, null=True)
    dinner_break_end = models.TimeField(blank=True, null=True)
    
    time_interval = models.TimeField(default=datetime.time(0, 15))
    checkin_amount = models.SmallIntegerField(default=1)
    
    active = models.BooleanField(default=True)
    create_date = models.DateField(auto_now_add=True)
    
    owner = models.ForeignKey(
        BusinessProfile, null=True, on_delete=models.SET_NULL
    )
    
    objects = ScheduleManager()
    
    def get_info(self):
        """Returns schedule info."""
        return  {
                'id': self.id,
                'name': self.name, 
                'description': self.description,
                'address': self.address,
                'tel_number': self.tel_number,
                'work_time_start': self.work_time_start,
                'work_time_end': self.work_time_end,
                'dinner_break_start': self.dinner_break_start,
                'dinner_break_end': self.dinner_break_end,
                'time_interval': self.time_interval
        }

    def get_available_time_for_checkin(self, date):
        """This method finds time available for checkins."""        
        date = datetime.datetime.strptime(date, '%Y-%m-%d')
        
        # Weekday number matchs bitmask
        weekdays = { 0: 1, 1: 2, 2: 4, 3: 8, 4: 16, 5: 32, 6: 64 }                 
        weekday = weekdays[date.weekday()]
        
        # If this date (weekday) is working
        if weekday & self.work_days:           
                       
            time_list = self.get_time_list()
                           
            # Get all checkins at this date for this schedule.
            checkins_by_date = self.checkin_set.filter(date=date)
            # Get set of time property of checkins (nonrepeating).
            checkin_times = set([
                str(ch.time) for ch in checkins_by_date
            ])
            
            # If amount of checkins in particular time equal to max
            # available checkins (checkin_amount filed of Schedule) then
            # remove this time from list  
            for t in checkin_times:
                if self.checkin_set.filter(
                            date=date, 
                            time=datetime.datetime.strptime(t, "%H:%M:%S")
                        ).count() >= self.checkin_amount:
                    try:
                        time_list.remove(t)
                    except ValueError:
                        pass
        else:
            return "Non-working day"
        
        return time_list

    def get_occupied_time(self, date):
        """Returns list of occupied time.

        Args:
            date (string): string in format 'YYYY-MM-DDTH:M:S'

        Get date from input date string and get QuerySet of all
        checkins on this date. Count how many checkins in same
        date and time. If amount of checkins in same date and time
        equal or more than possible (self.checkin_amount) than we
        can't add one more and add this datetime to returned list.
        """        
        from collections import Counter
        
        date = datetime.datetime.strptime(date.split("T")[0], '%Y-%m-%d')
        time_list = []
                           
        checkins_by_date = self.checkin_set.filter(date=date)
        checkin_times = [
            datetime.datetime.combine(ch.date, ch.time) for ch in checkins_by_date
        ]
    
        checkin_times_counted = Counter(checkin_times)

        for t in checkin_times_counted:
            if checkin_times_counted[t] >= self.checkin_amount:
                time_list.append(t)

        return time_list
    
    def get_time_list_v2(self):
        
        """
            Algorithm:
            1. Get start point (current) as today date 
            + work_time_start.
            2. Define if work_time_end is after midnight or not.
            (in other words, id start and end time are belongs
            different dates).
            3a. If work_time_end is before midnight, than end
            point: today + work_time_end.
            3b. Else end poind is today + one day + work_time_end.
            4. Get timedelta from time_interval.
            5. Using timedelta go from start time to end.
        """

        time_list = []
        current = datetime.datetime.combine(
            datetime.datetime.today(), self.work_time_start
        )

        if self.work_time_start > self.work_time_end:
            end = datetime.datetime.combine(
                datetime.datetime.today() + datetime.timedelta(days=1),
                self.work_time_end
            )
        else:
            end = datetime.datetime.combine(
                datetime.datetime.today(), self.work_time_end
            )

        delta = datetime.timedelta(
                    minutes=self.time_interval.minute
                )

        current_date = current.date()

        while current <= end:
            time_list.append(str(current.time()))
            current += delta

    def get_time_list(self):
        
        # Make list of all available time for this schedule.
        time_list = []
        current = datetime.datetime.combine(
            datetime.datetime.today(), self.work_time_start
        )    
        delta = datetime.timedelta(
                    minutes=self.time_interval.minute
                )            
        # If around the clock
        # current_date helps us detect, that next day started and
        # we must stop generating time list.
        # If work_time_start == work_time_end than around the clock.
        current_date = current.date()
        if self.work_time_start != self.work_time_end:
            while (current.time() <= self.work_time_end
                    and current.date() == current_date):
                time_list.append(str(current.time()))
                current += delta
        else:  
            while (current.time() <= datetime.time(23,59)
                    and current.date() == current_date):
                time_list.append(str(current.time()))
                current += delta      
        
        return time_list

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
    
    active = forms.BooleanField(initial=True, required=False)

    def save(self, user):
        self.cleaned_data['owner'] = user.bis_profile
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
    
    active = forms.BooleanField(initial=True, required=False)

    def save(self, schedule_id):
     #   self.cleaned_data['id'] = schedule_id
        schedule = Schedule.objects.update_or_create(pk=schedule_id, defaults=self.cleaned_data)
