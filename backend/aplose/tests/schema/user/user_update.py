import json

from django_extension.tests import ExtendedTestCase

from backend.aplose.models import User

QUERY = """
mutation ($email: String!) {
    currentUserUpdate(input: {
        email: $email
    }) {
        errors {
            field
            messages
        }
    }
}
"""
VARIABLES = {
    "email": "test@test.fr",
}


class UserUpdateTestCase(ExtendedTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ["users"]

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.gql_query(QUERY, variables=VARIABLES)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected(self):
        response = self.gql_query(
            QUERY, user=User.objects.get(username="user1"), variables=VARIABLES
        )
        self.assertResponseNoErrors(response)

        user: User = User.objects.get(username="user1")
        self.assertEqual(user.email, VARIABLES["email"])

    def test_connected_incorrect(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="user1"),
            variables={**VARIABLES, "email": "test"},
        )
        errors = json.loads(response.content)["data"]["currentUserUpdate"]["errors"]
        self.assertEqual(errors[0]["field"], "email")
        self.assertIn("Enter a valid email address.", errors[0]["messages"])
