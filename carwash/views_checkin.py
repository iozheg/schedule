import json

from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect, HttpResponseForbidden, JsonResponse
from django.core.exceptions import PermissionDenied
from django.urls import reverse
from django.views.decorators.csrf import ensure_csrf_cookie

from .models.checkin import CheckinCreateForm, Checkin, CheckinAmountForm
from .models.schedule import Schedule
from .models.user import ClientProfile

def create_checkin(request):
    
    if not hasattr(request.user, 'profile'):
        return HttpResponseRedirect(reverse('owner-profile'))
    
    if request.method == 'POST':
        
        form = CheckinCreateForm(request.POST)
        
        if form.is_valid():
            
            form.save(request.user)
            
            return HttpResponseRedirect(reverse('client-profile'))
            
    else:
        form = CheckinCreateForm()
    
    return render(request, 'create_checkin.html', {'form': form})


def checkin_details(request, checkin_id):
    
    try:
        checkin = Checkin.objects.get(pk=checkin_id)
        
    except Checkin.DoesNotExist:
        checkin = None
        
    return render(request, 'checkin_details.html', {'checkin': checkin})

def cancel_checkin(request, checkin_id):
    
    if not request.user.is_authenticated:
        raise PermissionDenied
    
    checkin = get_object_or_404(Checkin, pk=checkin_id)
    
    if not checkin.cancel(request.user.profile.id):
        raise PermissionDenied
    
    return HttpResponseRedirect(reverse('client-profile'))

def checkin_amount(request):
    
    amount = None
    
    if request.method == 'POST':
        
        form = CheckinAmountForm(request.POST)
        
        if form.is_valid():
            
            amount = form.save()
            
    else:
        
        form = CheckinAmountForm()
        
    return render(
        request, 'checkin_amount.html', {'form': form, 'amount': amount}
    )

@ensure_csrf_cookie
def book_time(request, schedule_id):
    """Book time.
    
    Booking - first step in creating checkin.
    Create preliminary checkin with client=None.

    Returns checkin id or error message.
    """    
    from datetime import datetime

    post_data = json.loads(request.body.decode('utf-8'))
    date = datetime.strptime(
        post_data['date'], 
        '%Y-%m-%dT%H:%M:%S'
    )

    schedule = Schedule.objects.get(id=schedule_id)
    checkin = Checkin.objects.add_checkin(
                    schedule=schedule, 
                    date=date.date(), 
                    time=date.time(), 
                    client=None
                )
    if checkin:
        checkin = checkin.id

    return JsonResponse({'result': checkin})

def cancel_booking(request, checkin_id):
    """Cancel previously booked time.
    
    While selecting time for checkin client may choose diffrent
    time, so we must cancel booking of previously selected time.
    """    
    # add user check

    checkin = Checkin.objects.get(id=checkin_id)

    if checkin.active == 2:
        checkin.delete()

    return JsonResponse({'result': 'success'})

def confirm_checkin(request):
    """Confirm previously created checkin.
    
    Confirm - second step in creating checkin.
    Now we recieve users info, create user profile, add it to checkin.

    If checkin.active!=2 than no such checkin or it was already 
    confirmed.

    Returns 'success' or error message.
    """
    # add user check

    post_data = json.loads(request.body.decode('utf-8'))

    try:
        checkin = Checkin.objects.get(id=post_data['checkin_id'])
    except Checkin.DoesNotExist:
        return JsonResponse({ 'result': 'no such checkin' })

    if checkin.active == 2:        
        try:
            client = ClientProfile.objects.create(
                user = None,
                tel_number = post_data['tel_number'],
                car_model = post_data['car_model'],
                car_reg_number = post_data['car_regplate']
            )
            client.save()        
        except:
            return JsonResponse({'result': 'can\'t create user'})
        checkin.confirm(client)
        response = 'success'
    else:
        response = 'fault'

    return JsonResponse({'result': response})