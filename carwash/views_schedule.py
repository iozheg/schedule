from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect
from django.urls import reverse

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
