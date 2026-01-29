import json

from graphene_django.utils import GraphQLTestCase

from backend.aplose.models import AnnotatorGroup, User

QUERY = """
query {
    allUserGroups {
        results {
            id
            name
            users {
                id
            }
        }
    }
}
"""


class AllUserGroupsTestCase(GraphQLTestCase):

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
        response = self.query(
            QUERY,
            user=User.objects.get(username="user1"),
        )
        self.assertResponseNoErrors(response)

        results = json.loads(response.content)["data"]["allUserGroups"]["results"]
        self.assertEqual(len(results), AnnotatorGroup.objects.count())
        self.assertEqual(results[0]["name"], "Annotators group")
        self.assertEqual(len(results[0]["users"]), 4)
