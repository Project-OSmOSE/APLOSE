"""API views annotation campaign list tests"""

from django.urls import reverse
from freezegun import freeze_time
from rest_framework import status
from rest_framework.test import APITestCase

from backend.api.tests.fixtures import ALL_FIXTURES

URL = reverse("annotation-campaign-detail", kwargs={"pk": 1})
URL_unknown = reverse("annotation-campaign-detail", kwargs={"pk": 186})


@freeze_time("2012-01-14 00:00:00")
class PostAnnotationCampaignsTestCase(APITestCase):

    fixtures = ALL_FIXTURES

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.client.patch(URL, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_connected_not_on_campaign(self):
        self.client.login(username="user4", password="osmose29")
        response = self.client.patch(URL, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_connected_not_allowed(self):
        self.client.login(username="user2", password="osmose29")
        response = self.client.patch(URL, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_connected_empty(self):
        self.client.login(username="admin", password="osmose29")
        response = self.client.patch(URL, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_connected_label_set(self):
        self.client.login(username="admin", password="osmose29")
        response = self.client.patch(URL, data={"label_set": 2}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["label_set"], 2)

    def test_connected_acoustic_features(self):
        self.client.login(username="admin", password="osmose29")
        response = self.client.patch(
            URL, data={"labels_with_acoustic_features": ["Mysticetes"]}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["labels_with_acoustic_features"], ["Mysticetes"])

    def test_connected_acoustic_features_out_of_set(self):
        self.client.login(username="admin", password="osmose29")
        response = self.client.patch(
            URL, data={"labels_with_acoustic_features": ["Dcall"]}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["labels_with_acoustic_features"].code, "invalid")

    def test_connected_confidence_set(self):
        self.client.login(username="admin", password="osmose29")
        response = self.client.patch(URL, data={"confidence_set": None}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNone(response.data["confidence_set"])

    def test_connected_allow_point_annotation(self):
        self.client.login(username="admin", password="osmose29")
        response = self.client.patch(
            URL, data={"allow_point_annotation": True}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["allow_point_annotation"])
