from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, RetrieveUpdateDestroyAPIView
from .serializers import *
from .models import *
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.exceptions import ValidationError
from django.utils import timezone
from django.core.cache import cache
from django.db import connection
from collections import defaultdict
from .createMeeting import createMeeting, getMeeting
from django.http import HttpResponse
import json
from rest_framework import generics
from rest_framework import viewsets
import django_filters


class InListFilter(django_filters.Filter):
    """multiple items filter"""
    def filter(self, qs, value):
        if value:
            return qs.filter(**{self.field_name + '__in': value.split(',')})
        return qs


class MultiIdFilterSet(django_filters.FilterSet):
    """use InListFilter"""
    id = InListFilter(field_name='id')


# General backend APIs
# these APIs do not need as much customization
# other customized and refined APIs are in separate files

class OpportunityViewSet(viewsets.ModelViewSet):
    queryset = Opportunity.objects.all()
    serializer_class = OpportunitySerializer
    filter_class = MultiIdFilterSet
    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('id',)


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter)
    search_fields = ('name',)
    filter_fields = ('id',)


class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter)
    search_fields = ('name',)
    filter_fields = ('id',)


class GeneralPagination(LimitOffsetPagination):
    default_limit = 5
    max_limit = 10


class UserList(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('username',)


class PersonList(ListAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filter_fields = ('type', 'location', 'user')
    search_fields = ('name',)


class PersonCreate(CreateAPIView):
    serializer_class = PersonSerializer


class PersonRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = Person.objects.all()
    lookup_field = 'id'
    serializer_class = PersonSerializer


class MeetingList(ListAPIView):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filter_fields = ('id', 'number', 'participants', 'time')
    search_fields = ('name',)


# pagination_class = GeneralPagination


user_skill_dict = defaultdict(list)
project_skill_dict = defaultdict(list)
category_skill_dict = defaultdict(list)


# retrieve list of all skills for a specific user
class Person_SkillList(ListAPIView):
    username = "sahil.punchhi"
    person_id = 1

    # with connection.cursor() as cursor:
    #     cursor.execute('''SELECT a.id FROM person_person a
    #     LEFT JOIN person_auth_user b on a.user_id = b.id
    #     WHERE b.username = %s''', [username])
    #     row = cursor.fetchone()
    # person_id = row[0]
    # for testing purposes


#   with connection.cursor() as cursor:
#      cursor.execute('''SELECT * FROM person_skill a''')
#     rows = cursor.fetchall()
# for row in rows:
#    if flag:
#       print(row)
########################################

#   def user_skill(my_id):
#      my_list=[]
#     with connection.cursor() as cursor:
#        cursor.execute('''SELECT b.skill_id FROM person_person a
#                       LEFT JOIN person_person_skills b on a.id=b.person_id
#                      WHERE a.id= %s''', [my_id])
#     rows = cursor.fetchall()
# for row in rows:
#   my_list.append(row[0])
# return my_list


# class Person_SkillList2(CreateAPIView):
#     def create(self, request, *args, **kwargs):
#         user = request.data.get('user')
#         # now = timezone.now()
#         # if time < now:
#         #     raise ValidationError({'time': 'Must be in the future'})
#         #
#         return super().create(request, *args, **kwargs)


class MeetingCreate(CreateAPIView):
    serializer_class = MeetingSerializer

    def create(self, request, *args, **kwargs):
        time = request.data.get('time')
        # now = timezone.now()
        # if time < now:
        #     raise ValidationError({'time': 'Must be in the future'})
        #
        return super().create(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        # retrieve request information
        request_string = request.read().decode('utf-8')
        request_obj = json.loads(request_string)

        # Formats datetime for Zoom
        datetime = request_obj['date'] + "T" + request_obj["time"] + ":00"
        
        # Sends a post request to Zoom API to create the meeting
        meeting_id = createMeeting(datetime, request_obj['duration'], request_obj['topic'])
        
        # Formats datetime for database
        db_datetime = request_obj['date'] + "T" + request_obj["time"] + "+10:00"
        
        participants = request_obj['participants']

        # Create meeting in database
        meeting = Meeting(name=request_obj['topic'], number=meeting_id, time=db_datetime)
        meeting.save()
        # Adds the participants to the meeting
        for user in participants:
            if (user != None):
                print(Person.objects.get(pk=user["value"]))
                meeting.participants.add(Person.objects.get(pk=user["value"]))
        # check errors
        print(Meeting.objects.all())
        
        # Returns the same response as Zoom when trying to retrieve the meeting
        # If the meeting was successfully created, it will return a success
        # if the meeting wasn't, zoom will respond with an appropriate error code
        response = HttpResponse(getMeeting(meeting_id))
        return response


class MeetingRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = Meeting.objects.all()
    lookup_field = 'id'
    serializer_class = MeetingSerializer

    def get(self, request, id):
        print(id)
        m = Meeting.objects.get(pk=int(id))
        response = super().get(request, id)
        response.data["url"] = getMeeting(m.number)
        return response


class SkillList(ListAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filter_fields = ('id',)
    search_fields = ('name',)


class OpportunityList(ListAPIView):
    queryset = Opportunity.objects.all()
    serializer_class = OpportunitySerializer
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filter_fields = ('id', 'person')
    search_fields = ('name',)

# class SkillRecommendList(generics.ListAPIView):
#
#     serializer_class = SkillRecommendSerializer
#
#     def get_queryset(self):
#         """
#         Optionally restricts the returned recommended skill to a given id,
#         by filtering against a `q` query parameter in the URL.
#         """
#         queryset = Person.objects.all()
#         my_id = self.request.query_params.get('q', None)
#         if my_id is not None:
#             queryset = queryset.filter(id=my_id)
#         return queryset
