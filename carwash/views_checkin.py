from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect
from django.urls import reverse

from .models.checkin import CheckinCreateForm, Checkin

def create_checkin(request):
    
    if not hasattr(request.user, 'profile'):
        return HttpResponseRedirect(reverse('owner-profile'))
    
    if request.method == 'POST':
        
        form = CheckinCreateForm(request.POST)
        
        if form.is_valid():
            
            form.save(request.user)
            
            return HttpResponseRedirect(reverse('client-profile'))
            
    form = CheckinCreateForm()
    
    return render(request, 'create_checkin.html', {'form': form})


def schedule_details(request, schedule_id):
    
    if request.method == 'POST':
        
        form = ScheduleDetailsForm(request.POST)
        
        if form.is_valid():
            
            form.save(schedule_id)
            
            return HttpResponseRedirect(reverse('schedule-details', args=(schedule_id,)))
            
    else:
        
        schedule = get_object_or_404(Schedule, pk=schedule_id)
        
        initial_data = {
            
        }
        
        form = ScheduleDetailsForm(initial=schedule.__dict__)
        
    return render(request, 'schedule_details.html', {'form': form, 'id': schedule_id})

