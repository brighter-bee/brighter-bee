from django.core import serializers
from django.db.models import Count
from django.http import HttpResponse
from .models import Project, Person
from django.views.decorators.http import require_http_methods

# Create your views here.


@require_http_methods(["GET"])
def recommend_project(request, person_id):
    person = Person.objects.get(pk=person_id)
    skills = list(person.skills.all().values_list('id', flat=True))
    print(skills)

    projects = Project.objects.all().filter(skills__in=skills).annotate(most_skills=Count('skills')).order_by('-most_skills')
    json = serializers.serialize("json", projects)

    return HttpResponse(json)
