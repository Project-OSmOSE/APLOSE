import json

from graphene_django.utils import GraphQLTestCase

from backend.api.models import AnnotationPhase
from backend.api.tests.fixtures import ALL_FIXTURES
from backend.api.tests.schema.spectrogram_analysis.all_spectrogram_analysis_for_import import (
    VARIABLES,
)

QUERY = """
query (
    $isArchived: Boolean
    $phase: AnnotationPhaseType
    $campaignID: ID
    $ownerID: ID
    $annotatorID: ID
    $search: String
) {
    allAnnotationPhases(
        annotationCampaignId: $campaignID
        isCampaignArchived: $isArchived
        phase: $phase
        annotationCampaign_OwnerId: $ownerID
        annotationFileRanges_AnnotatorId: $annotatorID
        search: $search
    ) {
        results {
            id
            phase
            fileRanges: annotationFileRanges {
                tasksCount
            }
            completedTasks: annotationSpectrograms(annotationTasks_Status: Finished) {
                totalCount
            }
            userFileRanges: annotationFileRanges(annotator: $annotatorID) {
                tasksCount
            }
            userCompletedTasks: annotationSpectrograms(annotationTasks_Status: Finished, annotator: $annotatorID) {
                totalCount
            }
            isOpen
        }
    }
}
"""
VARIABLES = {
    "isArchived": None,
    "phase": None,
    "ownerID": None,
    "annotatorID": None,
    "campaignID": None,
    "search": None,
}


class AllAnnotationPhasesTestCase(GraphQLTestCase):

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

    def test_connected_admin(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(QUERY, variables=VARIABLES)
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationPhases"]["results"]
        self.assertEqual(len(content), AnnotationPhase.objects.count())
        self.assertEqual(content[1]["phase"], "Annotation")

    def test_connected_owner(self):
        self.client.login(username="user1", password="osmose29")
        response = self.query(QUERY, variables=VARIABLES)
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationPhases"]["results"]
        self.assertEqual(len(content), AnnotationPhase.objects.count())
        self.assertEqual(content[1]["phase"], "Annotation")

    def test_connected_empty_user(self):
        self.client.login(username="user4", password="osmose29")
        response = self.query(QUERY, variables=VARIABLES)
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationPhases"]["results"]
        self.assertEqual(len(content), 0)

    def test_connected_admin_filter_owner(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "ownerID": 3,
            },
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationPhases"]["results"]
        self.assertEqual(len(content), AnnotationPhase.objects.count())
        self.assertEqual(content[1]["phase"], "Annotation")

    def test_connected_admin_filter_annotator(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "annotatorID": 1,
            },
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationPhases"]["results"]
        self.assertEqual(len(content), 3)
        self.assertEqual(content[0]["phase"], "Annotation")
        self.assertEqual(content[2]["phase"], "Verification")

    def test_connected_admin_filter_archive(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "isArchived": True,
            },
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationPhases"]["results"]
        self.assertEqual(len(content), 1)
        self.assertEqual(content[0]["phase"], "Annotation")

    def test_connected_admin_filter_phase(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={**VARIABLES, "phase": "Verification"},
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationPhases"]["results"]
        self.assertEqual(len(content), 1)
        self.assertEqual(content[0]["phase"], "Verification")

    def test_connected_admin_filter_campaign_id(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={**VARIABLES, "campaignID": 3},
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationPhases"]["results"]
        self.assertEqual(len(content), 1)
        self.assertEqual(content[0]["phase"], "Annotation")

    def test_connected_admin_search_name(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={**VARIABLES, "search": "RTF"},
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationPhases"]["results"]
        self.assertEqual(len(content), 1)
        self.assertEqual(content[0]["phase"], "Annotation")

    def test_connected_admin_search_dataset_name(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={**VARIABLES, "search": "glider"},
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationPhases"]["results"]
        self.assertEqual(len(content), AnnotationPhase.objects.count())
        self.assertEqual(content[0]["phase"], "Annotation")
