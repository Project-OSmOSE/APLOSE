import json

from django_extension.tests import ExtendedTestCase
from graphene_django.utils import GraphQLTestCase

from backend.api.tests.fixtures import ALL_FIXTURES
from backend.api.tests.schema.spectrogram_analysis.all_spectrogram_analysis_for_import import (
    VARIABLES,
)
from backend.aplose.models import User

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


class AnnotationPhaseByCampaignPhaseTestCase(ExtendedTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ALL_FIXTURES

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.gql_query(QUERY, variables=VARIABLES)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected_admin(self):
        response = self.gql_query(
            QUERY, user=User.objects.get(username="admin"), variables=VARIABLES
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["annotationPhaseByCampaignPhase"]
        self.assertEqual(content["phase"], "Annotation")

    def test_connected_owner(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="user1"),
            variables={**VARIABLES, "annotatorID": 3},
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["annotationPhaseByCampaignPhase"]
        self.assertEqual(content["phase"], "Annotation")

    def test_connected_empty_user(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="user4"),
            variables={**VARIABLES, "annotatorID": 6},
        )
        self.assertResponseHasErrors(response)
        self.assertEqual(
            json.loads(response.content)["errors"][0]["message"], "Not found"
        )
