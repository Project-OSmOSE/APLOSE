"""API views annotation campaign tests"""
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from backend.api.tests.fixtures import ALL_FIXTURES

URL = reverse("annotation-phase-list")


class ListAnnotationPhasesTestCase(APITestCase):

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

    def test_connected_user(self):
        self.client.login(username="user2", password="osmose29")
        response = self.client.get(URL, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)
        self.assertEqual(response.data[0]["annotation_campaign"], 1)
        self.assertEqual(response.data[1]["annotation_campaign"], 2)
        self.assertEqual(response.data[2]["annotation_campaign"], 4)
        self.assertEqual(response.data[0]["user_total"], 4)

    def test_connected_owner(self):
        self.client.login(username="user1", password="osmose29")
        response = self.client.get(URL, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 5)
        self.assertEqual(response.data[0]["annotation_campaign"], 1)
        self.assertEqual(response.data[1]["annotation_campaign"], 2)
        self.assertEqual(response.data[2]["annotation_campaign"], 3)
        self.assertEqual(response.data[2]["user_total"], 0)

    def test_connected_admin(self):
        self.client.login(username="admin", password="osmose29")
        response = self.client.get(URL, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 5)
        self.assertEqual(response.data[0]["annotation_campaign"], 1)
        self.assertEqual(response.data[1]["annotation_campaign"], 2)
        self.assertEqual(response.data[2]["annotation_campaign"], 3)
        self.assertEqual(response.data[2]["user_total"], 0)

    def test_connected_for_campaign(self):
        self.client.login(username="admin", password="osmose29")
        response = self.client.get(
            URL,
            {"annotation_campaign_id": 1},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["annotation_campaign"], 1)


class ListEmptyAnnotationPhasesTestCase(APITestCase):

    fixtures = ["users"]

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

    def test_connected_user(self):
        self.client.login(username="user2", password="osmose29")
        response = self.client.get(URL, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_connected_owner(self):
        self.client.login(username="user1", password="osmose29")
        response = self.client.get(URL, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_connected_admin(self):
        self.client.login(username="admin", password="osmose29")
        response = self.client.get(URL, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)
