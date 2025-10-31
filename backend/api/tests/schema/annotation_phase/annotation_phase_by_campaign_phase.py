import json

from graphene_django.utils import GraphQLTestCase

from backend.api.tests.fixtures import ALL_FIXTURES
from backend.api.tests.schema.spectrogram_analysis.all_spectrogram_analysis_for_import import (
    VARIABLES,
)

QUERY = """
query (
    $campaignID: ID!
    $phase: AnnotationPhaseType!
) {
    annotationPhaseByCampaignPhase(
        campaignId: $campaignID
        phaseType: $phase
    ) {
        id
        phase
        canManage
        endedAt
        tasksCount
        completedTasksCount
        userTasksCount
        userCompletedTasksCount
        hasAnnotations
    }
}
"""
VARIABLES = {
    "campaignID": 1,
    "phase": "Annotation",
}


class AnnotationPhaseByCampaignPhaseTestCase(GraphQLTestCase):

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

        content = json.loads(response.content)["data"]["annotationPhaseByCampaignPhase"]
        self.assertEqual(content["phase"], "Annotation")

    def test_connected_owner(self):
        self.client.login(username="user1", password="osmose29")
        response = self.query(QUERY, variables={**VARIABLES, "annotatorID": 3})
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["annotationPhaseByCampaignPhase"]
        self.assertEqual(content["phase"], "Annotation")

    def test_connected_empty_user(self):
        self.client.login(username="user4", password="osmose29")
        response = self.query(QUERY, variables={**VARIABLES, "annotatorID": 6})
        self.assertResponseHasErrors(response)
        self.assertEqual(
            json.loads(response.content)["errors"][0]["message"], "Not found"
        )
