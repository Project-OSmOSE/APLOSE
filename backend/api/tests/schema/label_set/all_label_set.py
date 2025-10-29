import json

from graphene_django.utils import GraphQLTestCase

from backend.api.models import LabelSet
from backend.api.tests.fixtures import ALL_FIXTURES
from backend.api.tests.schema.spectrogram_analysis.all_spectrogram_analysis_for_import import (
    VARIABLES,
)

QUERY = """
query {
    allLabelSets {
        results {
            id
            name
            description
            labels {
                id
                name
            }
        }
    }
}
"""


class AllLabelSetTestCase(GraphQLTestCase):

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

        content = json.loads(response.content)["data"]["allLabelSets"]["results"]
        self.assertEqual(len(content), LabelSet.objects.count())
        self.assertEqual(content[0]["name"], "Test SPM campaign")
        self.assertEqual(len(content[0]["labels"]), 5)
        self.assertEqual(content[0]["labels"][0]["name"], "Mysticetes")
