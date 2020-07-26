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

    with connection.cursor() as cursor:
        cursor.execute('''SELECT * FROM person_skill a''')
        rows = cursor.fetchall()
    for row in rows:
        if flag:
            print(row)
    ########################################

    def user_skill(my_id):
        my_list=[]
        with connection.cursor() as cursor:
            cursor.execute('''SELECT b.skill_id FROM person_person a
                            LEFT JOIN person_person_skills b on a.id=b.person_id
                            WHERE a.id= %s''', [my_id])
            rows = cursor.fetchall()
        for row in rows:
            my_list.append(row[0])
        return my_list


    def category_skill():
        with connection.cursor() as cursor:
            cursor.execute('''SELECT a.id, a.category_id FROM person_skill a''')
            rows = cursor.fetchall()
        for row in rows:
            category_skill_dict[row[1]].append(row[0])
        return category_skill_dict


    user_skill_dict[person_id] = user_skill(person_id)
    category_skill_dict = category_skill()
    if flag:
        print(user_skill_dict)
        print(category_skill_dict)

    project_skill_dict = {1 : [1,2,3], 2 : [4,5,6]}


    def recommend_skill_algo(user, user_skill_dict, category_skill_dict, project_skill_dict):

        no_of_skill_project = defaultdict(int)
        no_of_skill_category = defaultdict(int)
        no_of_skill_short_of_project = defaultdict(int)

        for skill in user_skill_dict[user]:
            for key, value in project_skill_dict.items():
                if skill in value:
                    no_of_skill_project[key] += 1
            for key,value in category_skill_dict.items():
                if skill in value:
                    no_of_skill_category[key] += 1

        for key,value in no_of_skill_project.items():
            no_of_skill_short_of_project[key] = len(project_skill_dict[key])-value

        # list of skills which are only short by 2 in the project
        skills = []
        t = 0; s = None

        no_of_skill_short_of_project = {k: v for k, v in sorted(no_of_skill_short_of_project.items(), key=lambda item: item[1]) if v != 0}

        if len(no_of_skill_short_of_project) > 0:
            s,t = next(iter(no_of_skill_short_of_project.items()))

        no_of_skill_category = {k: v for k, v in sorted(no_of_skill_category.items(), reverse=True, key=lambda item: item[1])}
        flag_ = True

        # if short of only 1 skill in the project
        if t == 1:
            project = s
            for skill in project_skill_dict[s]:
                if skill not in user_skill_dict[user]:
                    result = skill
                    break

        # if short of 2 skills in the project
        elif t == 2:
            project = s
            for skill in project_skill_dict[s]:
                if skill not in user_skill_dict[user]:
                    skills.append(skill)

            for key in no_of_skill_category.keys():
                for skill in skills:
                    if skill in category_skill_dict[key]:
                        result = skill
                        break

        # in all other cases (selects category which has maximum skills)
        else:
            for key in no_of_skill_category.keys():
                if flag_:
                    for skill in category_skill_dict[key]:
                        if skill not in user_skill_dict[user]:
                            result = skill
                            flag_ = False
                            break
                else:
                    break


        with connection.cursor() as cursor:
            cursor.execute('''SELECT a.name FROM person_skill a WHERE a.id = %s''', [result])
            row = cursor.fetchone()
            recommended_skill = row[0]

        if flag:
            print(no_of_skill_project)
            print(no_of_skill_category)
            print(no_of_skill_short_of_project)
            print("result is", result)
            print(recommended_skill)

        return recommended_skill

    recommend_skill_algo(person_id, user_skill_dict, category_skill_dict, project_skill_dict)

    queryset = Person.objects.all()
    lookup_field = 'location'
    serializer_class = PersonSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter)
    pagination_class = GeneralPagination

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
