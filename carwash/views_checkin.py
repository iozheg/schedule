from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect, HttpResponseForbidden
from django.core.exceptions import PermissionDenied
from django.urls import reverse

from .models.checkin import CheckinCreateForm, Checkin, CheckinAmountForm

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
