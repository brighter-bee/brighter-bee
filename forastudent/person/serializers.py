from django.db.models import Count, Case, When, IntegerField
from rest_framework import serializers
from .models import *


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class OpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity
        fields = '__all__'


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'


class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'


class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class RecommendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ('id', 'user', 'skills')

    def to_representation(self, instance):
        data = super().to_representation(instance)
        person_skills = list(instance.skills.values('id', 'name'))
        hottest_skill = Skill.objects.all().order_by('name')[:1].get().name
        projects = Opportunity.objects.all().filter(type='O')
        for project in projects:
            short = 0
            project_skills = project.skills.values('id', 'name')
            for project_skill in project_skills:
                if project_skill not in person_skills:
                    short += 1
                    hottest_skill = project_skill
            if short == 1:
                break
        hottest_skill = 'css'
        data['recommended_skill'] = hottest_skill
        return data
