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

flag = True

class GeneralPagination(LimitOffsetPagination):
    default_limit = 5
    max_limit = 10


class PersonList(ListAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filter_fields = ('type', 'location')
    search_fields = ('name',)
    pagination_class = GeneralPagination


class MeetingList(ListAPIView):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filter_fields = ('id', 'number', 'participants', 'time')
    search_fields = ('name',)
    pagination_class = GeneralPagination


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
        #for row in rows:
         #   my_list.append(row[0])
        #return my_list


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
        request_string = request.read().decode('utf-8')
        request_obj = json.loads(request_string)
        
        datetime = request_obj['date'] + "T" + request_obj["time"] + "Z"
        meeting_id = createMeeting(datetime, request_obj['duration'],request_obj['topic'])
        db_datetime = request_obj['date'] + "T" + request_obj["time"] + "+11:00"
        print(db_datetime)
        participants = []
        # check errors
        with connection.cursor() as cursor:
            sql = f"""INSERT INTO person_meeting (name, number, time) 
               VALUES ('{request_obj['topic']}',{meeting_id},'{db_datetime}');"""
            cursor.execute(sql)
            cursor.execute('select * from person_meeting where number = ' + str(meeting_id))
            new_meeting = cursor.fetchall()


        response = HttpResponse(getMeeting(meeting_id))   
        return response

class MeetingRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = Meeting.objects.all()
    lookup_field = 'id'
    serializer_class = MeetingSerializer

    def delete(self, request, *args, **kwargs):
        mid = request.data.get('id')
        response = super().delete(request, *args, **kwargs)
        if response.status_code == 204:
            cache.delete(f'meeting_data_{mid}')
        return response

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if response.status_code == 200:
            meeting = response.data
            cache.set(f"meeting_data_{meeting['id']}", {
                'name': meeting['name'],
                'time': meeting['time'],
                'number': meeting['number'],
                'participants': meeting['participants'],
            })
        return response
