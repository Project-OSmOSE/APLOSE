import json

from django_extension.tests import ExtendedTestCase

from backend.api.models import AnnotationFileRange
from backend.api.tests.fixtures import ALL_FIXTURES
from backend.aplose.models import User

MUTATION = """
mutation deleteFileRange($id: ID!) {
    deleteFileRange(id: $id) {
        error {
            field
            messages
        }
    }
}
"""
VARIABLES = {"id": 0}


class DeleteAnnotationFileRangeTestCase(ExtendedTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ALL_FIXTURES

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def _assert_no_errors(self, response):
        content = json.loads(response.content)["data"]["deleteFileRange"]
        self.assertEqual(response.status_code, 200, content)
        errors = [e for e in content["errors"] if e != []]
        self.assertEqual(len(errors), 0, content)

    def _assert_has_errors(self, response):
        content = json.loads(response.content)["data"]["deleteFileRange"]
        errors = [e for e in content["errors"] if e != []]
        self.assertGreater(len(errors), 0, content)

    def test_not_connected(self):
        response = self.gql_query(MUTATION, variables=VARIABLES)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected_unknown(self):
        response = self.gql_query(
            MUTATION,
            user=User.objects.get(username="admin"),
            variables={**VARIABLES, "campaignID": 99},
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Not found")

    def test_connected_no_access(self):
        response = self.gql_query(
            MUTATION, user=User.objects.get(username="user4"), variables=VARIABLES
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Not found")

    def test_connected_not_allowed(self):
        response = self.gql_query(
            MUTATION, user=User.objects.get(username="user2"), variables=VARIABLES
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Not found")

    def test_owner_delete(self):
        old_count = AnnotationFileRange.objects.count()
        response = self.gql_query(
            MUTATION,
            user=User.objects.get(username="admin"),
            variables={"id": 3},
        )
        self.assertResponseNoErrors(response)
        self.assertEqual(AnnotationFileRange.objects.count(), old_count - 1)
        self.assertFalse(AnnotationFileRange.objects.filter(id=3).exists())

    def test_owner_delete_with_finished_tasks(self):
        old_count = AnnotationFileRange.objects.count()
        response = self.gql_query(
            MUTATION,
            user=User.objects.get(username="admin"),
            variables={"id": 1},
        )
        self.assertResponseNoErrors(response)
        self.assertEqual(AnnotationFileRange.objects.count(), old_count - 1)
        self.assertFalse(AnnotationFileRange.objects.filter(id=1).exists())
