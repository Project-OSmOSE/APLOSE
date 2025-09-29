import json

from graphene_django.utils import GraphQLTestCase

from backend.aplose.models import AnnotatorGroup

QUERY = """
query {
    allUserGroups {
        results {
            pk
            name
            annotators {
                edges {
                    node {
                        pk
                    }
                }
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
        self.client.login(username="user1", password="osmose29")
        response = self.query(QUERY)
        self.assertResponseNoErrors(response)

        results = json.loads(response.content)["data"]["allUserGroups"]["results"]
        self.assertEqual(len(results), AnnotatorGroup.objects.count())
        self.assertEqual(results[0]["name"], "Annotators group")
        self.assertEqual(len(results[0]["annotators"]["edges"]), 4)
