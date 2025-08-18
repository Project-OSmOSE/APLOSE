import json

from graphene_django.utils import GraphQLTestCase

from backend.api.tests.fixtures import DATA_FIXTURES

QUERY = """
query getDatasetByID($id: ID!) {
  datasetById(id: $id) {
    name
    createdAt
    legacy
    start
    end
    owner {
      displayName
    }
  }
}
"""


class DatasetByIdTestCase(GraphQLTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ["users", *DATA_FIXTURES]

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.query(QUERY, variables={"id": 1})
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected(self):
        self.client.login(username="user1", password="osmose29")
        response = self.query(QUERY, variables={"id": 1})
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["datasetById"]
        self.assertEqual(content["name"], "gliderSPAmsDemo")
        self.assertEqual(content["start"], "2012-10-03T10:00:00+00:00")
        self.assertEqual(content["end"], "2012-10-03T20:15:00+00:00")
