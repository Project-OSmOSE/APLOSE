import json

from django_extension.tests import ExtendedTestCase

from backend.api.tests.fixtures import DATA_FIXTURES
from backend.aplose.models import User

QUERY = """
query ($id: ID!) {
    datasetById(id: $id) {
        name
        createdAt
        legacy
        path
        description
        start
        end
        owner {
            id
        }
    }
}
"""


class DatasetByPkTestCase(ExtendedTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ["users", *DATA_FIXTURES]

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.gql_query(QUERY, variables={"id": 1})
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected(self):
        response = self.gql_query(
            QUERY, user=User.objects.get(username="user1"), variables={"id": 1}
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["datasetById"]
        self.assertEqual(content["name"], "gliderSPAmsDemo")
        self.assertEqual(content["path"], "gliderSPAmsDemo")
        self.assertEqual(content["owner"]["id"], "1")
        self.assertEqual(content["start"], "2010-08-19T00:00:00+00:00")
        self.assertEqual(content["end"], "2013-11-02T00:00:00+00:00")
