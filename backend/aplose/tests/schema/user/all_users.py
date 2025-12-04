import json

from graphene_django.utils import GraphQLTestCase

from backend.aplose.models import User

QUERY = """
query {
    allUsers {
        results {
            id
            displayName
            expertise
        }
    }
}
"""


class AllUsersTestCase(GraphQLTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ["users"]

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

        results = json.loads(response.content)["data"]["allUsers"]["results"]
        self.assertEqual(len(results), User.objects.count())
        self.assertEqual(results[0]["id"], "1")
        self.assertEqual(results[0]["displayName"], "admin Aplose")
        self.assertEqual(results[0]["expertise"], "Expert")
