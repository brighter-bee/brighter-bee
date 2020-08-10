"""forastudent URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.conf import settings

from rest_framework import routers

import person.api_views
import person.views
import person.skill_view

router = routers.DefaultRouter()
router.register(r'opportunity', person.api_views.OpportunityViewSet)
router.register(r'project', person.api_views.ProjectViewSet)

urlpatterns = [
    # path('api/v2/skills', person.api_views.RecommendSkill.as_view()),
    path('api/', include(router.urls)),
    path('recommend/<int:person_id>', person.views.recommend_skill),
    path('api/v2/skills', person.api_views.SkillList.as_view()),
    path('api/v2/users', person.api_views.UserList.as_view()),
    path('api/v2/persons', person.api_views.PersonList.as_view()),
    path('api/v2/persons/new', person.api_views.PersonCreate.as_view()),
    path('api/v2/persons/<int:id>/', person.api_views.PersonRetrieveUpdateDestroy.as_view()),
    path('api/v2/meetings', person.api_views.MeetingList.as_view()),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/v2/meetings/new', person.api_views.MeetingCreate.as_view()),
    path('api/v2/meetings/<int:id>/', person.api_views.MeetingRetrieveUpdateDestroy.as_view()),
    path('api/v2/accounts/', include('rest_registration.api.urls')),
    path('skill-recommend/<int:person_id>', person.skill_view.recommend_skill),  # flask url for skill recommendation
    # path('my-skill-recommend', person.api_views.SkillRecommendList.as_view()), # django url for skill recommendation
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
