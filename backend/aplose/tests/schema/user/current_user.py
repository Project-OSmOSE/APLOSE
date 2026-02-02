import json

from django_extension.tests import ExtendedTestCase

from backend.aplose.models import User

QUERY = """
query {
    currentUser {
        id
        displayName
        isAdmin
    }
}
"""


class CurrentUserTestCase(ExtendedTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ["users"]

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.gql_query(QUERY)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected_user(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="user1"),
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["currentUser"]
        self.assertEqual(content["id"], "3")
        self.assertEqual(content["displayName"], "user1 Aplose")
        self.assertFalse(content["isAdmin"])

    def test_connected_staff(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="staff"),
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["currentUser"]
        self.assertEqual(content["id"], "2")
        self.assertEqual(content["displayName"], "staff Aplose")
        self.assertTrue(content["isAdmin"])

    def test_connected_admin(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="admin"),
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["currentUser"]
        self.assertEqual(content["id"], "1")
        self.assertEqual(content["displayName"], "admin Aplose")
        self.assertTrue(content["isAdmin"])
