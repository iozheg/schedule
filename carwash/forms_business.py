from django import forms
from django.contrib.auth.models import User

from .models import BusinessProfile

class OwnerRegistrationForm(forms.Form):
    email = forms.CharField(label='Email', max_length=50)
    password = forms.CharField(widget=forms.PasswordInput)
    name = forms.CharField(max_length=50)
    tel_number = forms.CharField(label='Telephone')
   
    def save(self):
        user = User.objects.create_user(
                        username=self.cleaned_data['email'], 
                        password=self.cleaned_data['password']
        )
        user.save()
        user_profile = BusinessProfile.objects.create(
                        user=user, 
                        name=self.cleaned_data['name'], 
                        tel_number=self.cleaned_data['tel_number']
        )
        
        return user


class OwnerProfileForm(forms.Form):
    name = forms.CharField(max_length=50, required=False)
    tel_number = forms.CharField(label='Telephone')
    
    def save(self, user):
        user.profile.name = self.cleaned_data['name']
        user.profile.tel_number = self.cleaned_data['tel_number']
        
        user.profile.save()
        
        return user
