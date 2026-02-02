import json

from django_extension.tests import ExtendedTestCase
from freezegun import freeze_time
from graphene_django.utils import GraphQLTestCase

from backend.api.models import AnnotationPhase
from backend.api.tests.fixtures import DATA_FIXTURES, COMMON_FIXTURES
from backend.aplose.models import User

QUERY = """
mutation ($campaignID: ID!, $type: AnnotationPhaseType!) {
    createAnnotationPhase(campaignId: $campaignID, type: $type) {
        id
    }
}
"""
ANNOTATION_VARIABLES = {"campaignID": 1, "type": "Annotation"}
VERIFICATION_VARIABLES = {"campaignID": 1, "type": "Verification"}


@freeze_time("2012-01-14 00:00:00")
class CreateAnnotationPhaseTestCase(ExtendedTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = [
        "users",
        *DATA_FIXTURES,
        *COMMON_FIXTURES,
        "annotation_campaign",
        "label",
        "label_set",
        "confidence",
        "confidence_set",
    ]

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.gql_query(QUERY, variables=VERIFICATION_VARIABLES)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected_unknown(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="admin"),
            variables={"campaignID": 99, "type": "Verification"},
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Not found")

    def test_connected_no_access(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="user4"),
            variables=VERIFICATION_VARIABLES,
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Not found")

    def test_connected_not_allowed(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="user2"),
            variables=VERIFICATION_VARIABLES,
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Not found")

    def _test_create(self, username: str):
        old_count = AnnotationPhase.objects.count()

        response = self.gql_query(
            QUERY,
            user=User.objects.get(username=username),
            variables=ANNOTATION_VARIABLES,
        )
        self.assertResponseNoErrors(response)
        pk = json.loads(response.content)["data"]["createAnnotationPhase"]["id"]
        phase = AnnotationPhase.objects.get(pk=pk)
        self.assertTrue(phase.is_open)
        self.assertEqual(phase.phase, "A")
        self.assertEqual(phase.created_at.isoformat(), "2012-01-14T00:00:00+00:00")
        self.assertEqual(phase.created_by.username, username)

        response = self.gql_query(
            QUERY,
            user=User.objects.get(username=username),
            variables=VERIFICATION_VARIABLES,
        )
        self.assertResponseNoErrors(response)
        pk = json.loads(response.content)["data"]["createAnnotationPhase"]["id"]
        phase = AnnotationPhase.objects.get(pk=pk)
        self.assertTrue(phase.is_open)
        self.assertEqual(phase.phase, "V")
        self.assertEqual(phase.created_at.isoformat(), "2012-01-14T00:00:00+00:00")
        self.assertEqual(phase.created_by.username, username)

        self.assertEqual(old_count + 2, AnnotationPhase.objects.count())

    def test_connected_admin(self):
        self._test_create("admin")

    def test_connected_owner(self):
        self._test_create("user1")
