from django import forms
from django.contrib.auth.models import User
from .models import ClientProfile

class ClientRegistrationForm(forms.Form):
    username = forms.CharField(label='Email', max_length=50)
   # email = forms.CharField(max_length=100)
    password = forms.CharField(widget=forms.PasswordInput)
   # is_staff = forms.CharField(initial='True', widget=forms.HiddenInput)
   # tel_number = forms.CharField(label='Телефон: ', max_length=15)
   
    def save(self):
        user = User.objects.create_user(username=self.cleaned_data['username'], password=self.cleaned_data['password'])
        user.save()
        user_profile = ClientProfile.objects.create(user=user)
        
        return user


class LoginForm(forms.Form):
    username = forms.CharField(label='Email', max_length=50)
    password = forms.CharField(widget=forms.PasswordInput)


class ClientProfileForm(forms.Form):
    name = forms.CharField(max_length=50, required=False)
    tel_number = forms.CharField(label='Telephone')
    car_model = forms.CharField(label='Car', max_length=40, required=False)
    car_reg_number = forms.CharField(max_length=10, required=False)
    
    def save(self, user):
        user.profile.name = self.cleaned_data['name']
        user.profile.tel_number = self.cleaned_data['tel_number']
        user.profile.car_model = self.cleaned_data['car_model']
        user.profile.car_reg_number = self.cleaned_data['car_reg_number']
   #     self.cleaned_data['id'] = user.profile.id
   #     profile = ClientProfile(**self.cleaned_data)
        user.profile.save()
        
        return user
