from django.core.serializers import serialize
from django.db.models import Count, Case, When, IntegerField
from rest_framework import serializers
from .models import *
from django.db import connection
from collections import defaultdict

flag = True


class SkillSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    category = serializers.SlugRelatedField(
        read_only=True,
        slug_field='name'
    )

    class Meta:
        model = Skill
        fields = '__all__'

    def get_full_name(self, instance):
        return '{} ({})'.format(instance.name, instance.category)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class OpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'


class PersonSerializer(serializers.ModelSerializer):
    skills_names = serializers.SerializerMethodField()

    class Meta:
        model = Person
        fields = '__all__'

    def get_skills_names(self, instance):
        skills_names = []
        for s in instance.skills.all():
            skills_names.append(s.name)
        return skills_names

    # def to_representation(self, instance):
    #     data = super().to_representation(instance)
    #     skillList = []
    #     for skillId in data['skills']:
    #         skill = Skill.objects.all().get(id=skillId)
    #         skillList.append(skill)
    #     data['named_skills'] = serialize('json', skillList)
    #     return data


class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


# class SkillRecommendSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Person
#         fields = ('id',)
#
#     def to_representation(self, instance):
#         data = super().to_representation(instance)
#         # considering instance from above model
#         person_id = str(instance.id)
#         print("person_id is ", person_id)
#
#         user_skill_dict = defaultdict(list)
#         project_skill_dict = defaultdict(list)
#         category_skill_dict = defaultdict(list)
#
#         ########### for testing purposes #########
#         with connection.cursor() as cursor:
#             cursor.execute('''SELECT * FROM person_person a''')
#             rows = cursor.fetchall()
#         for row in rows:
#             if flag:
#                 print(row)
#         with connection.cursor() as cursor:
#             cursor.execute('''SELECT * FROM person_skill a''')
#             rows = cursor.fetchall()
#         for row in rows:
#             if flag:
#                 print(row)
#         with connection.cursor() as cursor:
#             cursor.execute('''SELECT * FROM person_project a''')
#             rows = cursor.fetchall()
#         for row in rows:
#             if flag:
#                 print(row)
#         with connection.cursor() as cursor:
#             cursor.execute('''SELECT * FROM person_person_skills a''')
#             rows = cursor.fetchall()
#         for row in rows:
#             if flag:
#                 print(row)
#         with connection.cursor() as cursor:
#             cursor.execute('''SELECT * FROM person_project_skills a''')
#             rows = cursor.fetchall()
#         for row in rows:
#             if flag:
#                 print(row)
#         ########################################
#
#         def user_skill(my_id):
#             my_list=[]
#             with connection.cursor() as cursor:
#                 cursor.execute('''SELECT b.skill_id FROM person_person a
#                                 LEFT JOIN person_person_skills b on a.id=b.person_id
#                                 WHERE a.id= %s''', [my_id])
#                 rows = cursor.fetchall()
#             for row in rows:
#                 my_list.append(row[0])
#             return my_list
#
#
#         def category_skill():
#             my_category_skill_dict = defaultdict(list)
#             with connection.cursor() as cursor:
#                 cursor.execute('''SELECT a.id, a.category_id FROM person_skill a''')
#                 rows = cursor.fetchall()
#             for row in rows:
#                 my_category_skill_dict[row[1]].append(row[0])
#             return my_category_skill_dict
#
#
#         def project_skill():
#             my_project_skill_dict = defaultdict(list)
#             with connection.cursor() as cursor:
#                 cursor.execute('''SELECT a.project_id, a.skill_id FROM person_project_skills a''')
#                 rows = cursor.fetchall()
#             for row in rows:
#                 my_project_skill_dict[row[0]].append(row[1])
#             return my_project_skill_dict
#
#
#         user_skill_dict[person_id] = user_skill(person_id)
#         category_skill_dict = category_skill()
#         # project_skill_dict = project_skill()
#         project_skill_dict = {1 : [1,2,3], 2 : [4,5,6]}
#
#         if flag:
#             print(user_skill_dict)
#             print(category_skill_dict)
#             print(project_skill_dict)
#
#
#         def recommend_skill_algo(user, user_skill_dict, category_skill_dict, project_skill_dict):
#
#             no_of_skill_project = defaultdict(int)
#             no_of_skill_category = defaultdict(int)
#             no_of_skill_short_of_project = defaultdict(int)
#
#             for skill in user_skill_dict[user]:
#                 for key, value in project_skill_dict.items():
#                     if skill in value:
#                         no_of_skill_project[key] += 1
#                 for key,value in category_skill_dict.items():
#                     if skill in value:
#                         no_of_skill_category[key] += 1
#
#             for key,value in no_of_skill_project.items():
#                 no_of_skill_short_of_project[key] = len(project_skill_dict[key])-value
#
#             # list of skills which are only short by 2 in the project
#             skills = []
#             t = 0; s = None
#
#             no_of_skill_short_of_project = {k: v for k, v in sorted(no_of_skill_short_of_project.items(), key=lambda item: item[1]) if v != 0}
#
#             if len(no_of_skill_short_of_project) > 0:
#                 s,t = next(iter(no_of_skill_short_of_project.items()))
#
#             no_of_skill_category = {k: v for k, v in sorted(no_of_skill_category.items(), reverse=True, key=lambda item: item[1])}
#             flag_ = True
#
#             # if short of only 1 skill in the project
#             if t == 1:
#                 project = s
#                 for skill in project_skill_dict[s]:
#                     if skill not in user_skill_dict[user]:
#                         result = skill
#                         break
#
#             # if short of 2 skills in the project
#             elif t == 2:
#                 project = s
#                 for skill in project_skill_dict[s]:
#                     if skill not in user_skill_dict[user]:
#                         skills.append(skill)
#
#                 for key in no_of_skill_category.keys():
#                     for skill in skills:
#                         if skill in category_skill_dict[key]:
#                             result = skill
#                             break
#
#             # in all other cases (selects category which has maximum skills)
#             else:
#                 for key in no_of_skill_category.keys():
#                     if flag_:
#                         for skill in category_skill_dict[key]:
#                             if skill not in user_skill_dict[user]:
#                                 result = skill
#                                 flag_ = False
#                                 break
#                     else:
#                         break
#
#
#             with connection.cursor() as cursor:
#                 cursor.execute('''SELECT a.name FROM person_skill a WHERE a.id = %s''', [result])
#                 row = cursor.fetchone()
#                 recommended_skill = row[0]
#
#             if flag:
#                 print(no_of_skill_project)
#                 print(no_of_skill_category)
#                 print(no_of_skill_short_of_project)
#                 print("result is", result)
#                 print(recommended_skill)
#
#             return recommended_skill
#
#
#
#         data['recommended_skill'] = recommend_skill_algo(person_id, user_skill_dict, category_skill_dict, project_skill_dict)
#
#         return data


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        ordering = ['-id']
        model = Post
        fields = "__all__"


class LogicalDeletePostSerializer(serializers.Serializer):

    isDeleted = serializers.BooleanField(default=False)

    def update(self, instance, validated_data):
        instance.isDeleted = validated_data['isDeleted']
        instance.save()
        return instance


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        ordering = ['-id']
        model = Reply
        fields = '__all__'


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        ordering = ['-id']
        model = ForumCategory
        fields = '__all__'
