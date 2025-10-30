"""API views annotation campaign list tests"""

from django.urls import reverse
from freezegun import freeze_time
from rest_framework import status
from rest_framework.test import APITestCase

from backend.api.models import AnnotationCampaign, AnnotationPhase
from backend.api.tests.fixtures import ALL_FIXTURES

URL = reverse("annotation-phase-list")

creation_data = {"phase": "Verification", "annotation_campaign": 1}


@freeze_time("2012-01-14 00:00:00")
class PostAnnotationPhaseTestCase(APITestCase):

    fixtures = ALL_FIXTURES

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.client.post(URL, creation_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_connected_not_on_campaign(self):
        self.client.login(username="user4", password="osmose29")
        response = self.client.post(URL, creation_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_connected_not_allowed(self):
        self.client.login(username="user2", password="osmose29")
        response = self.client.post(URL, creation_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_connected(self):
        self.client.login(username="admin", password="osmose29")
        old_count = AnnotationPhase.objects.count()
        response = self.client.post(URL, creation_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(AnnotationPhase.objects.count(), old_count + 1)
        phase = AnnotationPhase.objects.latest("id")

        self.assertEqual(response.data["id"], phase.id)
        self.assertEqual(response.data["phase"], "Verification")
        self.assertEqual(response.data["created_by"], "admin")
        self.assertEqual(response.data["created_at"], "2012-01-14T00:00:00Z")
        self.assertEqual(response.data["global_progress"], 0)
        self.assertEqual(response.data["global_total"], 0)
        self.assertEqual(response.data["user_progress"], 0)
        self.assertEqual(response.data["user_total"], 0)
        self.assertTrue(response.data["has_annotations"])

    def test_connected_if_phase_exists_fails(self):
        self.client.login(username="admin", password="osmose29")
        old_count = AnnotationPhase.objects.count()
        response = self.client.post(
            URL, {"phase": "Annotation", "annotation_campaign": 1}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data.get("non_field_errors")[0].code, "unique")
        self.assertEqual(AnnotationPhase.objects.count(), old_count)

    def test_connected_verification_if_no_annotation_fails(self):
        self.client.login(username="admin", password="osmose29")
        campaign = AnnotationCampaign.objects.create(
            owner_id=3,
            dataset_id=1,
            name="Empty",
        )
        old_count = AnnotationPhase.objects.count()
        response = self.client.post(
            URL,
            {"phase": "Verification", "annotation_campaign": campaign.id},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data.get("non_field_errors")[0].code, "invalid")
        self.assertEqual(AnnotationPhase.objects.count(), old_count)
