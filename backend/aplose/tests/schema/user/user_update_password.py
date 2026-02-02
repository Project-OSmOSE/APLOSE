import json

from django_extension.tests import ExtendedTestCase
from graphene_django.utils import GraphQLTestCase

from backend.aplose.models import User

QUERY = """
mutation ($oldPassword: String!, $newPassword: String!) {
    userUpdatePassword(input: {
        oldPassword: $oldPassword
        newPassword: $newPassword
    }) {
        errors {
            field
            messages
        }
    }
}
"""
VARIABLES = {
    "oldPassword": "osmose29",
    "newPassword": "osmose99",
}


class UserUpdatePasswordTestCase(ExtendedTestCase):

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
        self.assertTrue(user.check_password("osmose99"))

    def test_connected_incorrect_old_password(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="user1"),
            variables={**VARIABLES, "oldPassword": "<PASSWORD>"},
        )
        errors = json.loads(response.content)["data"]["userUpdatePassword"]["errors"]
        self.assertEqual(errors[0]["field"], "oldPassword")
        self.assertIn("Incorrect old password.", errors[0]["messages"])

    def test_connected_password_too_common(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="user1"),
            variables={**VARIABLES, "newPassword": "<PASSWORD>"},
        )
        errors = json.loads(response.content)["data"]["userUpdatePassword"]["errors"]
        self.assertEqual(errors[0]["field"], "newPassword")
        self.assertIn("This password is too common.", errors[0]["messages"])
