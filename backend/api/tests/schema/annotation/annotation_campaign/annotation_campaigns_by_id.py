import json

from graphene_django.utils import GraphQLTestCase

from backend.api.tests.fixtures import ALL_FIXTURES
from backend.api.tests.schema.data.spectrogram_analysis.all_spectrogram_analysis_for_import import (
    VARIABLES,
)

QUERY = """
query ($id: ID!) {
    annotationCampaignById(id: $id) {
        name
        createdAt
        owner {
            displayName
            email
        }
        phases(orderBy: "phase") {
            results {
                phase
            }
        }
        archive {
            id
            date
            byUser {
                displayName
            }
        }
    }
}
"""
VARIABLES = {
    "id": 1,
}
ARCHIVED_VARIABLES = {
    "id": 3,
}


class AnnotationCampaignsByIDTestCase(GraphQLTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ALL_FIXTURES

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def _test_get_by_id(self, username: str):
        self.client.login(username=username, password="osmose29")
        response = self.query(QUERY, variables=VARIABLES)
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["annotationCampaignById"]
        self.assertEqual(content["name"], "Test SPM campaign")
        self.assertEqual(content["owner"]["email"], "user1@osmose.xyz")
        self.assertEqual(
            content["phases"]["results"][0]["phase"],
            "Annotation",
        )
        self.assertIsNone(content["archive"])

    def _test_get_by_id_archived(self, username: str):
        self.client.login(username=username, password="osmose29")
        response = self.query(QUERY, variables=ARCHIVED_VARIABLES)
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["annotationCampaignById"]
        self.assertEqual(content["name"], "Test RTF campaign")
        self.assertEqual(content["owner"]["email"], "user1@osmose.xyz")
        self.assertEqual(
            content["phases"]["results"][0]["phase"],
            "Annotation",
        )
        self.assertIsNotNone(content["archive"])

    def test_not_connected(self):
        response = self.query(QUERY, variables=VARIABLES)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected_empty_user(self):
        self.client.login(username="user4", password="osmose29")
        response = self.query(QUERY, variables=VARIABLES)
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)["data"]["annotationCampaignById"]
        self.assertIsNone(content)

    def test_connected_annotator(self):
        self._test_get_by_id("user2")

    def test_connected_annotator_archived(self):
        self.client.login(username="user2", password="osmose29")
        response = self.query(QUERY, variables=ARCHIVED_VARIABLES)
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)["data"]["annotationCampaignById"]
        self.assertIsNone(content)

    def test_connected_owner(self):
        self._test_get_by_id("user1")

    def test_connected_owner_archived(self):
        self._test_get_by_id_archived("user1")

    def test_connected_admin(self):
        self._test_get_by_id("admin")

    def test_connected_admin_archived(self):
        self._test_get_by_id_archived("admin")
