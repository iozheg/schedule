from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login

from .forms import ClientRegistrationForm, LoginForm, ClientProfileForm

def test(request, *args, **kwargs):
	return HttpResponse('OK')


def client_registration(request):
    
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse('client_profile'))
    
    if request.method == 'POST':
        form = ClientRegistrationForm(request.POST)
        
        if form.is_valid():
            user = form.save()
            
            login(request, user)
            
            return HttpResponseRedirect(reverse('client_profile'))
    
    else:
        form = ClientRegistrationForm()
        
    return render(request, 'client_registration.html', {'form': form})


def client_profile(request):
    
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse('login')) 
    
    if request.method == 'POST':
        form = ClientProfileForm(request.POST)
        
        if form.is_valid():
            form.save(request.user)
            return HttpResponseRedirect(reverse('client_profile'))
    
    else:        
        user = request.user
        initial_data = {
                        'name': user.profile.name,
                        'tel_number': user.profile.tel_number,
                        'car_model' : user.profile.car_model,
                        'car_reg_number' : user.profile.car_reg_number
        }
        form = ClientProfileForm(initial=initial_data)
        
    return render(request, 'client_profile.html', {'user': user, 'form': form})


def user_login(request):
    '''View for user (client) login'''
    
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse('client_profile'))
    
    error = None
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse('client_profile'))
        else:
            form = LoginForm()
            error = 'Login/password error'
    else:
        form = LoginForm()
    
    return render(request, 'login_form.html', {'form': form, 'error': error})
 
    
def show_all_users(request):
    
    users = User.objects.all()
    
    return render(request, 'all_users.html', {'users': users})
    
