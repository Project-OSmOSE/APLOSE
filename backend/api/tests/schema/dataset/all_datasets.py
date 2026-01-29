import json

from django_extension.tests import ExtendedTestCase

from backend.api.models import Dataset
from backend.api.tests.fixtures import DATA_FIXTURES
from backend.aplose.models import User

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


class AllDatasetsTestCase(ExtendedTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ["users", *DATA_FIXTURES]

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.gql_query(QUERY)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="user1"),
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allDatasets"]["results"]
        self.assertEqual(len(content), Dataset.objects.count())
        self.assertEqual(content[0]["id"], "1")

        self.assertEqual(content[0]["spectrogramCount"], 11)
        self.assertEqual(content[0]["start"], "2010-08-19T00:00:00+00:00")
        self.assertEqual(content[0]["end"], "2013-11-02T00:00:00+00:00")

        self.assertEqual(content[0]["analysisCount"], 2)
        self.assertEqual(content[0]["spectrogramAnalysis"]["results"][0]["id"], "1")
