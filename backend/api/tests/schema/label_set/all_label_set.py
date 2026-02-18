import json

from django_extension.tests import ExtendedTestCase

from backend.api.models import LabelSet
from backend.api.tests.fixtures import ALL_FIXTURES
from backend.aplose.models import User

QUERY = """
query {
    allLabelSets {
        results {
            id
            name
            description
            labels {
                id
                name
            }
        }
    }
}
"""


class AllLabelSetTestCase(ExtendedTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ALL_FIXTURES

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
            QUERY, user=User.objects.get(username="admin"), variables=VARIABLES
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allLabelSets"]["results"]
        self.assertEqual(len(content), LabelSet.objects.count())
        self.assertEqual(content[0]["name"], "Test SPM campaign")
        self.assertEqual(len(content[0]["labels"]), 5)
        self.assertEqual(content[0]["labels"][0]["name"], "Mysticetes")
