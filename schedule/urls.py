"""schedule URL Configuration
 
The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin

from carwash import views, views_business, views_schedule, views_checkin

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'signup/$', views.client_registration),
    url(r'business/$', views_business.owner_registration),
    url(r'allusers/$', views.show_all_users),    #this must be deleted
    url(r'^owner_profile/$', views_business.owner_profile, name='owner-profile'),
    url(r'^profile/$', views.client_profile, name='client-profile'),    
    url(r'^login/$', views.user_login, name='user-login'),
   # url(r'business_login/', views_business.owner_login, name='owner_login'),
    url(r'logout/$', views.user_logout),
    url(r'addschedule/$', views_schedule.create_schedule),
    url(r'addcheckin/$', views_checkin.create_checkin, name='add-checkin'),
    url(r'schedule/(?P<schedule_id>\d+)/$', views_schedule.schedule_details, name='schedule-details'),
    #url(r'checkin/(?P<checkin_id>\d+)/$', views_checkin.checkin_details, name='checkin-details'),
    url(r'^$', views.test)
]
