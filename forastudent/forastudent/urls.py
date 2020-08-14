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
import person.project_view


from person.forum_view import PostView, CommentView, TopicView

# The APIs' urls are listed here

router = routers.DefaultRouter()
router.register(r'opportunity', person.api_views.OpportunityViewSet)
router.register(r'project', person.api_views.ProjectViewSet)
router.register(r'skill', person.api_views.SkillViewSet)

urlpatterns = [
    # path('api/v2/skills', person.api_views.RecommendSkill.as_view()),
    # path('project', person.views.get_projects),
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
    path('project-recommend/<int:person_id>', person.project_view.recommend_project),
    # path('my-skill-recommend', person.api_views.SkillRecommendList.as_view()), # django url for skill recommendation
    # endpoint url for the forum module
    path('forum/', PostView.as_view({"get": "getPostList", "post": "create"})),
    path('forum/<int:pk>/', PostView.as_view({"get": "getCurrentPost", "delete": "deletePost", "put": "update"})),
    path('myPosts/<int:poster>/', PostView.as_view({"get": "getMyPostsList"})),
    path('forum/topics/', TopicView.as_view({"get": "getTopicList"})),
    path('reply/', CommentView.as_view({"get": "getCommentList", "post": "create"})),
    path('reply/reply/', CommentView.as_view({"get": "getCurrentReplyList", "post": "create"}))
]

# The url for user upload files path
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
