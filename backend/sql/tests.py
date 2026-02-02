"""Tests for SQL ViewSet"""
from django.urls import reverse
from django_extension.tests import ExtendedTestCase
from rest_framework import status

from backend.aplose.models import User

URL = reverse("sql-post")
SELECT_DATA = {"query": "SELECT * FROM api_label"}
DROP_DATA = {"query": "DROP TABLE api_label"}
INSERT_DATA = {"query": "INSERT INTO api_label (name) VALUES ('test')"}
UPDATE_DATA = {"query": "UPDATE api_label SET name='test'"}


class SqlViewSetTestCase(ExtendedTestCase):
    fixtures = ["users", "label_set", "label"]

    # 401
    def test_post_unauthenticated(self):
        response = self.client.post(URL, SELECT_DATA)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # 403
    def test_post_base_user(self):
        self.log_client(User.objects.get(username="user1"))
        response = self.client.post(URL, SELECT_DATA)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_post_staff(self):
        self.log_client(User.objects.get(username="staff"))
        response = self.client.post(URL, SELECT_DATA)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # 200
    def test_post_superuser(self):
        self.log_client(User.objects.get(username="admin"))
        response = self.client.post(URL, SELECT_DATA)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 7)
        self.assertEqual(len(response.data["results"]), 7)

    # 406
    def test_post_superuser_drop(self):
        self.log_client(User.objects.get(username="admin"))
        response = self.client.post(URL, DROP_DATA)
        self.assertEqual(response.status_code, status.HTTP_406_NOT_ACCEPTABLE)

    def test_post_superuser_insert(self):
        self.log_client(User.objects.get(username="admin"))
        response = self.client.post(URL, INSERT_DATA)
        self.assertEqual(response.status_code, status.HTTP_406_NOT_ACCEPTABLE)

    def test_post_superuser_update(self):
        self.log_client(User.objects.get(username="admin"))
        response = self.client.post(URL, UPDATE_DATA)
        self.assertEqual(response.status_code, status.HTTP_406_NOT_ACCEPTABLE)
