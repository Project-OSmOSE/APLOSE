"""API views annotation campaign retrieve tests"""
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from backend.api.tests.fixtures import ALL_FIXTURES

URL = reverse("annotation-campaign-detail", kwargs={"pk": 1})


class RetrieveAnnotationCampaignsTestCase(APITestCase):

    fixtures = ALL_FIXTURES

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.client.get(URL, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_connected_empty_user(self):
        self.client.login(username="user4", password="osmose29")
        response = self.client.get(URL, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_connected(self):
        self.client.login(username="user1", password="osmose29")
        response = self.client.get(URL, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Test SPM campaign")
        self.assertEqual(response.data["owner"]["username"], "user1")
        self.assertEqual(response.data["deadline"], "2010-11-02")
        self.assertIsNone(response.data["archive"])
