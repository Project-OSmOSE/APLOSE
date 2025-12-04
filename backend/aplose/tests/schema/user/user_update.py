import json

from graphene_django.utils import GraphQLTestCase

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


class UserUpdateTestCase(GraphQLTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ["users"]

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.query(QUERY, variables=VARIABLES)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected(self):
        self.client.login(username="user1", password="osmose29")
        response = self.query(QUERY, variables=VARIABLES)
        self.assertResponseNoErrors(response)

        user: User = User.objects.get(username="user1")
        self.assertEqual(user.email, VARIABLES["email"])

    def test_connected_incorrect(self):
        self.client.login(username="user1", password="osmose29")
        response = self.query(QUERY, variables={**VARIABLES, "email": "test"})
        errors = json.loads(response.content)["data"]["currentUserUpdate"]["errors"]
        self.assertEqual(errors[0]["field"], "email")
        self.assertIn("Enter a valid email address.", errors[0]["messages"])
