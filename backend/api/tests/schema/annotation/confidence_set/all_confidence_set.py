import json

from graphene_django.utils import GraphQLTestCase

from backend.api.models import ConfidenceSet
from backend.api.tests.fixtures import ALL_FIXTURES
from backend.api.tests.schema.data.spectrogram_analysis.all_spectrogram_analysis_for_import import (
    VARIABLES,
)

QUERY = """
query {
    allConfidenceSets {
        results {
            id
            name
            desc
            confidenceIndicators {
                label
                level
            }
        }
    }
}
"""


class AllConfidenceSetTestCase(GraphQLTestCase):

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

    def test_connected(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(QUERY, variables=VARIABLES)
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allConfidenceSets"]["results"]
        self.assertEqual(len(content), ConfidenceSet.objects.count())
        self.assertEqual(content[0]["name"], "Confidence/NoConfidence")
        self.assertEqual(len(content[0]["confidenceIndicators"]), 2)
        self.assertEqual(content[0]["confidenceIndicators"][0]["label"], "confident")
        self.assertEqual(content[0]["confidenceIndicators"][0]["level"], 0)
