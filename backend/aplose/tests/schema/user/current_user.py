import json

from graphene_django.utils import GraphQLTestCase

QUERY = """
query {
    currentUser {
        pk
        displayName
        isAdmin
    }
}
"""


class CurrentUserTestCase(GraphQLTestCase):

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

    def test_connected_user(self):
        self.client.login(username="user1", password="osmose29")
        response = self.query(QUERY)
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["currentUser"]
        self.assertEqual(content["pk"], 3)
        self.assertEqual(content["displayName"], "user1 Aplose")
        self.assertFalse(content["isAdmin"])

    def test_connected_staff(self):
        self.client.login(username="staff", password="osmose29")
        response = self.query(QUERY)
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["currentUser"]
        self.assertEqual(content["pk"], 2)
        self.assertEqual(content["displayName"], "staff Aplose")
        self.assertTrue(content["isAdmin"])

    def test_connected_admin(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(QUERY)
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["currentUser"]
        self.assertEqual(content["pk"], 1)
        self.assertEqual(content["displayName"], "admin Aplose")
        self.assertTrue(content["isAdmin"])
