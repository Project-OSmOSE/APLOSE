"""API views annotation campaign list tests"""
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from backend.api.models import AnnotationCampaign
from backend.api.tests.fixtures import ALL_FIXTURES

URL = reverse("annotation-campaign-list")


class ListAnnotationCampaignsTestCase(APITestCase):

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
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_connected_owner(self):
        self.client.login(username="user1", password="osmose29")
        response = self.client.get(URL, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)
        self.assertEqual(response.data[0]["name"], "Test DCLDE LF campaign")
        self.assertEqual(response.data[1]["name"], "Test RTF campaign")
        self.assertEqual(response.data[1]["phases"][0], 3)

    def test_connected_admin(self):
        self.client.login(username="admin", password="osmose29")
        response = self.client.get(URL, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), AnnotationCampaign.objects.count())
        self.assertEqual(response.data[0]["name"], "Test DCLDE LF campaign")
        self.assertEqual(response.data[1]["name"], "Test RTF campaign")
        self.assertEqual(response.data[1]["phases"][0], 3)

    def test_connected_admin_filter_owner(self):
        self.client.login(username="admin", password="osmose29")
        response = self.client.get(URL, {"owner": 3}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)
        self.assertEqual(response.data[0]["name"], "Test DCLDE LF campaign")
        self.assertEqual(response.data[1]["name"], "Test RTF campaign")
        self.assertEqual(response.data[1]["phases"][0], 3)

    def test_connected_admin_filter_annotator(self):
        self.client.login(username="admin", password="osmose29")
        response = self.client.get(
            URL, {"phases__annotation_file_ranges__annotator_id": 1}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)
        self.assertEqual(response.data[0]["name"], "Test DCLDE LF campaign")
        self.assertEqual(response.data[1]["name"], "Test SPM campaign")

    def test_connected_admin_filter_archive(self):
        self.client.login(username="admin", password="osmose29")
        response = self.client.get(URL, {"archive__isnull": "false"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Test RTF campaign")

    def test_connected_admin_filter_phase(self):
        self.client.login(username="admin", password="osmose29")
        response = self.client.get(URL, {"phases__phase": "V"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Test Z check campaign")

    def test_connected_admin_search_name(self):
        self.client.login(username="admin", password="osmose29")
        response = self.client.get(URL, {"search": "rtf"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Test RTF campaign")

    def test_connected_admin_search_dataset_name(self):
        self.client.login(username="admin", password="osmose29")
        response = self.client.get(URL, {"search": "glider"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)
        self.assertEqual(response.data[0]["name"], "Test DCLDE LF campaign")
