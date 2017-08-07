from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth import authenticate, login

from .forms_business import OwnerRegistrationForm, OwnerProfileForm


def owner_registration(request):
    
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse('owner-profile'))
    
    if request.method == 'POST':
        form = OwnerRegistrationForm(request.POST)
        
        if form.is_valid():
            user = form.save()
            
            login(request, user)
            
            return HttpResponseRedirect(reverse('owner-profile'))
    
    else:
        form = OwnerRegistrationForm()
        
    return render(request, 'business_registration.html', {'form': form, 'profile': reverse('owner-profile')})


def owner_profile(request):
    ''' View for owner profile
    
        Here we provide forms for viewing and changing owner profile
        
    '''
    
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse('owner-login'))
    if hasattr(request.user, 'profile'):
        return HttpResponseRedirect(reverse('client-profile'))
    
    if request.method == 'POST':
        form = OwnerProfileForm(request.POST)
        
        if form.is_valid():
            form.save(request.user)
            return HttpResponseRedirect(reverse('owner-profile'))
    
    else:        
        user = request.user
        initial_data = {
                        'name': user.bis_profile.name,
                        'tel_number': user.bis_profile.tel_number
        }
        form = OwnerProfileForm(initial=initial_data)
        
    return render(request, 'client_profile.html', {'user': user, 'form': form, 'owner': True})


def owner_login(request):
    '''View for user (business) login'''
    
    if request.user.is_authenticated and request.user.profile:
        return HttpResponseRedirect(reverse('client-profile'))
    elif request.user.is_authenticated and request.user.bis_profile:
        return HttpResponseRedirect(reverse('owner-profile'))
    
    action = '/business_login/'
    error = None
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse('owner-profile'))
        else:
            form = LoginForm()
            error = 'Login/password error'
    else:
        form = LoginForm()
    
    return render(request, 'login_form.html', {'form': form, 'error': error, 'action': action})
