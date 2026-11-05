"""Tests for SQL ViewSet"""
from django.urls import reverse
from django_extension.tests import ExtendedTestCase
from rest_framework import status

from backend.aplose.models import User

URL = reverse("sql-post")
SELECT_DATA = {"query": "SELECT * FROM mx_ontology_label"}
DROP_DATA = {"query": "DROP TABLE mx_ontology_label"}
INSERT_DATA = {
    "query": "INSERT INTO mx_ontology_label (nickname, source_id) VALUES ('test', 1)"
}
UPDATE_DATA = {"query": "UPDATE mx_ontology_label SET nickname='test'"}


class SqlViewSetTestCase(ExtendedTestCase):
    fixtures = ["users", "label"]

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
        self.assertEqual(response.data["count"], 8)
        self.assertEqual(len(response.data["results"]), 8)

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
