"""API views annotation campaign list tests"""

from django.urls import reverse
from freezegun import freeze_time
from rest_framework import status
from rest_framework.test import APITestCase

from backend.api.models import AnnotationCampaign
from backend.api.tests.fixtures import ALL_FIXTURES

URL = reverse("annotation-campaign-list")

creation_data = {
    "name": "string",
    "desc": "string",
    "deadline": "2022-01-30",
    "dataset": 1,
    "analysis": [1],
    "created_at": "2012-01-14T00:00:00Z",
}


@freeze_time("2012-01-14 00:00:00")
class PostAnnotationCampaignsTestCase(APITestCase):

    fixtures = ALL_FIXTURES

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.client.post(URL, creation_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_connected(self):
        self.client.login(username="user1", password="osmose29")
        old_count = AnnotationCampaign.objects.count()
        response = self.client.post(URL, creation_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(AnnotationCampaign.objects.count(), old_count + 1)
        campaign = AnnotationCampaign.objects.latest("id")

        self.assertEqual(response.data["id"], campaign.id)
        self.assertEqual(response.data["confidence_set"], None)
        self.assertEqual(response.data["label_set"], None)
        self.assertEqual(response.data["dataset"]["name"], "gliderSPAmsDemo")
        self.assertEqual(response.data["archive"], None)
        self.assertEqual(response.data["allow_point_annotation"], False)
        self.assertEqual(list(campaign.analysis.values_list("id", flat=True)), [1])

    def test_connected_double_post(self):
        self.client.login(username="user1", password="osmose29")
        old_count = AnnotationCampaign.objects.count()
        response_1 = self.client.post(URL, creation_data, format="json")
        self.assertEqual(response_1.status_code, status.HTTP_201_CREATED)

        response_2 = self.client.post(URL, creation_data, format="json")
        self.assertEqual(response_2.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_2.data.get("name")[0].code, "unique")

        self.assertEqual(AnnotationCampaign.objects.count(), old_count + 1)
