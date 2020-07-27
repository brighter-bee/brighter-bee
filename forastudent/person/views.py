from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.
from django.views.decorators.http import require_http_methods


@require_http_methods(["GET"])
def recommend_skill(request, person_id):
    return JsonResponse({
        'person_id': person_id,
        'recommended_skill': 'Django'
    })
