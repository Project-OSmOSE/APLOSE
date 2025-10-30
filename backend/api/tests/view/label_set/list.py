"""API views label set tests"""
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from backend.api.models import LabelSet
from backend.api.tests.fixtures import ALL_FIXTURES

URL = reverse("label-set-list")


class ListLabelSetTestCase(APITestCase):

    fixtures = ALL_FIXTURES

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.client.get(URL, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_connected(self):
        self.client.login(username="user4", password="osmose29")
        response = self.client.get(URL, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), LabelSet.objects.count())
        self.assertEqual(
            list(response.data[1].keys()), ["id", "labels", "name", "description"]
        )
        self.assertEqual(response.data[1]["name"], "Test SPM campaign")
        self.assertEqual(
            response.data[1]["labels"],
            ["Mysticetes", "Odoncetes", "Boat", "Rain", "Other"],
        )


class ListEmptyLabelSetTestCase(APITestCase):

    fixtures = ["users"]

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.client.get(URL, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_connected(self):
        self.client.login(username="user4", password="osmose29")
        response = self.client.get(URL, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)
