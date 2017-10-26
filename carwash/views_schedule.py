from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from django.urls import reverse
from django.core import serializers

from .models.schedule import ScheduleCreateForm, ScheduleDetailsForm, Schedule

def create_schedule(request):
    
    if request.method == 'POST':
        
        form = ScheduleCreateForm(request.POST)
        
        if form.is_valid():
            
            form.save(request.user)
            
            return HttpResponseRedirect(reverse('owner-profile'))
            
    else:
        form = ScheduleCreateForm()
    
    return render(request, 'create_schedule.html', {'form': form})


def schedule_details(request, schedule_id):
    
    if request.method == 'POST':
        
        form = ScheduleDetailsForm(request.POST)
        
        if form.is_valid():
            
            form.save(schedule_id)
            
            return HttpResponseRedirect(reverse('schedule-details', args=(schedule_id,)))
            
    else:
        
        schedule = get_object_or_404(Schedule, pk=schedule_id)
        
        form = ScheduleDetailsForm(initial=schedule.__dict__)
        
    return render(request, 'schedule_details.html', {'form': form, 'schedule': schedule})


def checkins_by_date(request, schedule_id):
    """ for testing purposes """
    import datetime
    
    schedule = Schedule.objects.get(id=schedule_id)
    checkins = schedule.get_available_time_for_checkin(date=request.POST.get('checkin_date'))
    
 #   out = ' '.join(str(ch.time) for ch in checkins)
    
 #   for ch in checkins:
 #       out += str(ch.time)
        
    return render(
        request, 
        'test_checkins_by_date.html', 
        {
            'date': request.POST.get('checkin_date', 'oh!'), 
            'time': checkins
        }
    )

def get_schedules_names(request):
    """For testing http requests from Angular app."""
    name = request.GET.get('name')
    schedules_names = Schedule.objects.get_filtered_names(name)
    
    return JsonResponse( {'schedules': schedules_names} )

def get_schedules_brief_info(request):
    """Returns schedule info."""
    name = request.GET.get('name')
    schedules_info = Schedule.objects.get_brief_info(name)

    return JsonResponse( {'schedules': schedules_info} )

def get_schedule_detail_info(request, schedule_id):
    """Returns schedule detailed info."""
    schedule = Schedule.objects.get(id=schedule_id)
    schedule_info = schedule.get_info()

    return JsonResponse( {'schedule': schedule_info} )

#NOT USED
def get_available_time_for_checkin(request, schedule_id):

    date = request.GET.get('date')
    schedule = Schedule.objects.get(id=schedule_id)
    time_list = schedule.get_available_time_for_checkin(date=date)

    return JsonResponse({'time': time_list})

def get_occupied_time(request, schedule_id):

    from datetime import datetime

    date = request.GET.get('date')
    date = datetime.strptime(date.split("T")[0], '%Y-%m-%d')
    schedule = Schedule.objects.get(id=schedule_id)
    time_list = schedule.get_occupied_time(date)

    return JsonResponse({'time_list': time_list})

