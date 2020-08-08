from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, RetrieveUpdateDestroyAPIView
from .serializers import *
from .models import *
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.exceptions import ValidationError
from django.utils import timezone
from django.core.cache import cache
from rest_framework import generics


class GeneralPagination(LimitOffsetPagination):
    default_limit = 5
    max_limit = 10


class UserList(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = (DjangoFilterBackend, )
    filter_fields = ('username', )


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
    pagination_class = GeneralPagination


class MeetingCreate(CreateAPIView):
    serializer_class = MeetingSerializer


class MeetingRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = Meeting.objects.all()
    lookup_field = 'id'
    serializer_class = MeetingSerializer


class SkillList(ListAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filter_fields = ('id', )
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
