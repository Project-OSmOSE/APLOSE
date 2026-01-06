import json

from graphene_django.utils import GraphQLTestCase

from backend.api.models import Dataset
from backend.api.tests.fixtures import DATA_FIXTURES

QUERY = """
query {
    allDatasets(orderBy: "-createdAt" ) {
        results {
            id
            name
            description
            createdAt
            legacy
            analysisCount
            spectrogramCount
            start
            end
            spectrogramAnalysis(orderBy: "name") {
                results {
                    id
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
        self.assertEqual(content[0]["id"], "1")

        self.assertEqual(content[0]["spectrogramCount"], 11)
        self.assertEqual(content[0]["start"], "2010-08-19T00:00:00+00:00")
        self.assertEqual(content[0]["end"], "2013-11-02T00:00:00+00:00")

        self.assertEqual(content[0]["analysisCount"], 2)
        self.assertEqual(content[0]["spectrogramAnalysis"]["results"][0]["id"], "1")
