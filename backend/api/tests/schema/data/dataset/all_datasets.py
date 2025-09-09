import json

from graphene_django.utils import GraphQLTestCase

from backend.api.models import Dataset
from backend.api.tests.fixtures import DATA_FIXTURES

QUERY = """
query {
    allDatasets(orderBy: "-createdAt" ) {
        results {
            pk
            name
            description
            createdAt
            legacy
            analysisCount
            filesCount
            start
            end
            spectrogramAnalysis(orderBy: "name") {
                results {
                    pk
                    name
                    colormap {
                        name
                    }
                }
            }
        }
    }
}
"""


class AllDatasetsTestCase(GraphQLTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ["users", *DATA_FIXTURES]

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.query(QUERY)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected(self):
        self.client.login(username="user1", password="osmose29")
        response = self.query(QUERY)
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allDatasets"]["results"]
        self.assertEqual(len(content), Dataset.objects.count())
        self.assertEqual(content[0]["name"], "gliderSPAmsDemo")
        self.assertEqual(content[0]["analysisCount"], 2)
        self.assertEqual(content[0]["filesCount"], 11)
        self.assertEqual(content[0]["start"], "2012-10-03T10:00:00+00:00")
        self.assertEqual(content[0]["end"], "2012-10-03T20:15:00+00:00")
        self.assertEqual(
            content[0]["spectrogramAnalysis"]["results"][0]["name"], "spectro_config1"
        )
        self.assertEqual(
            content[0]["spectrogramAnalysis"]["results"][0]["colormap"]["name"], "Greys"
        )
