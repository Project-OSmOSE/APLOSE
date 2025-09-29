"""API views confidence set tests"""
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from backend.api.models import ConfidenceSet
from backend.api.tests.fixtures import ALL_FIXTURES

URL = reverse("confidence-set-list")


class ListConfidenceSetTestCase(APITestCase):

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
        self.assertEqual(len(response.data), ConfidenceSet.objects.count())
        self.assertEqual(
            list(response.data[0].keys()),
            ["id", "confidence_indicators", "name", "desc"],
        )
        self.assertEqual(response.data[0]["name"], "Confidence/NoConfidence")
        self.assertEqual(
            response.data[0]["confidence_indicators"][0]["label"], "confident"
        )
        self.assertEqual(response.data[0]["confidence_indicators"][0]["level"], 0)


class ListEmptyConfidenceSetTestCase(APITestCase):

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
