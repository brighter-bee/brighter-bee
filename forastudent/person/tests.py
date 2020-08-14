from django.test import TestCase
from rest_framework.test import APITestCase

from .models import *


class MeetingCreateTestCase(APITestCase):
    """test case for backend api"""

    def test_create_meeting(self):
        initial_meeting_count = Meeting.objects.count()
        meeting = {
            "name": "Q",
            "number": "4",
            "time": "2020-03-04T20:20",
            "participants": [
                1
            ]
        }
        response = self.client.post('/api/v2/meetings/new', meeting)
        if response.status_code != 201:
            print(response.data)
        for attr, expected in meeting.items():
            self.assertEqual(response.data[attr], expected)
        self.assertEqual(
            Meeting.objects.count(),
            initial_meeting_count + 1
        )
