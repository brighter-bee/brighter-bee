from rest_framework.generics import ListAPIView
from .serializers import *
from .models import *
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework.pagination import LimitOffsetPagination


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
