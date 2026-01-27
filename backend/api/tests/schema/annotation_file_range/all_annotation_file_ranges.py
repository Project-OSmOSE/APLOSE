import json

from graphene_django.utils import GraphQLTestCase

from backend.api.tests.fixtures import ALL_FIXTURES
from backend.api.tests.schema.spectrogram_analysis.all_spectrogram_analysis_for_import import (
    VARIABLES,
)

QUERY = """
query (
    $campaignID: ID
    $phaseType: AnnotationPhaseType
) {
    allAnnotationFileRanges(
        annotationPhase_AnnotationCampaign: $campaignID
        annotationPhase_Phase: $phaseType
    ) {
        results {
            id
            firstFileIndex
            lastFileIndex

            annotator {
                id
                displayName
            }

            filesCount
            spectrograms {
                totalCount
            }

            completedAnnotationTasks: annotationTasks(status: Finished) {
                totalCount
            }
        }
    }
}
"""
VARIABLES = {
    "campaignID": 1,
    "phaseType": "Annotation",
}


class AllAnnotationFileRangesTestCase(GraphQLTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ALL_FIXTURES

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.query(QUERY, variables=VARIABLES)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    # List all phases

    def _test_connected_all(self, expected_count=6):
        response = self.query(QUERY)
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationFileRanges"]
        self.assertEqual(len(content["results"]), expected_count)

    def test_connected_admin_all(self):
        """Admin should have access to all annotation file ranges"""
        self.client.login(username="admin", password="osmose29")
        self._test_connected_all()

    def test_connected_owner_all(self):
        """Owner should have access to all its campaign annotation file ranges"""
        self.client.login(username="user1", password="osmose29")
        self._test_connected_all()

    def test_connected_annotator_all(self):
        """Annotator should have access to its annotation file ranges"""
        self.client.login(username="user2", password="osmose29")
        self._test_connected_all(expected_count=3)

    def test_connected_empty_user_all(self):
        """Base user without annotation campaign should have access to none annotation file ranges"""
        self.client.login(username="user4", password="osmose29")
        self._test_connected_all(expected_count=0)

    # List for VARIABLES
    VARIABLES = {
        "campaignID": 1,
        "phaseType": "Annotation",  # id=1
    }

    def _test_connected_for_phase(self, expected_count=2):
        response = self.query(QUERY, variables=self.VARIABLES)
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationFileRanges"]
        self.assertEqual(len(content["results"]), expected_count)
        if expected_count == 6:
            self.assertEqual(content["results"][0]["id"], "1")
            self.assertEqual(content["results"][0]["annotator"]["id"], "1")
            self.assertEqual(content["results"][0]["filesCount"], 6)
            self.assertEqual(content["results"][0]["spectrograms"]["totalCount"], 6)
            self.assertEqual(
                content["results"][0]["completedAnnotationTasks"]["totalCount"], 1
            )
        return content

    def test_connected_admin_for_phase(self):
        """Admin should have access to all annotation file ranges"""
        self.client.login(username="admin", password="osmose29")
        self._test_connected_for_phase()

    def test_connected_owner_for_phase(self):
        """Owner should have access to all its campaign annotation file ranges"""
        self.client.login(username="user1", password="osmose29")
        self._test_connected_for_phase()

    def test_connected_annotator_for_phase(self):
        """Annotator should have access to its annotation file ranges"""
        self.client.login(username="user2", password="osmose29")
        content = self._test_connected_for_phase(expected_count=1)

        self.assertEqual(content["results"][0]["id"], "3")
        self.assertEqual(content["results"][0]["annotator"]["id"], "4")
        self.assertEqual(content["results"][0]["filesCount"], 4)
        self.assertEqual(content["results"][0]["spectrograms"]["totalCount"], 4)
        self.assertEqual(
            content["results"][0]["completedAnnotationTasks"]["totalCount"], 0
        )
