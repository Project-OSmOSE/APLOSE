import json

from graphene_django.utils import GraphQLTestCase

from backend.api.models import Detector
from backend.api.tests.fixtures import ALL_FIXTURES
from backend.api.tests.schema.data.spectrogram_analysis.all_spectrogram_analysis_for_import import (
    VARIABLES,
)

QUERY = """
query {
    allDetectors {
        results {
            id
            name
            configurations {
                id
                configuration
            }
        }
    }
}
"""


class AllDetectorsTestCase(GraphQLTestCase):

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

        content = json.loads(response.content)["data"]["allDetectors"]["results"]
        self.assertEqual(len(content), Detector.objects.count())
        self.assertEqual(content[0]["name"], "Detector 1")
        self.assertEqual(len(content[0]["configurations"]), 1)
        self.assertEqual(
            content[0]["configurations"][0]["configuration"], "Detector configuration 1"
        )
