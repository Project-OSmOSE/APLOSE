import json

from django_extension.tests import ExtendedTestCase

from backend.api.models import AnnotationFileRange
from backend.api.tests.fixtures import ALL_FIXTURES
from backend.aplose.models import User

MUTATION = """
mutation updateFileRange($id: ID!, $first: Int!, $last: Int!) {
    updateFileRange(input: {
        id: $id
        firstFileIndex: $first
        lastFileIndex: $last
    }) {
        errors {
            field
            messages
        }
    }
}
"""
VARIABLES = {
    "id": 3,
    "first": 4,
    "last": 5,
}


class UpdateAnnotationFileRangeTestCase(ExtendedTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ALL_FIXTURES

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def _assert_no_errors(self, response):
        content = json.loads(response.content)["data"]["updateFileRange"]
        self.assertEqual(response.status_code, 200, content)
        errors = [e for e in content["errors"] if e != []]
        self.assertEqual(len(errors), 0, content)

    def _assert_has_errors(self, response):
        content = json.loads(response.content)["data"]["updateFileRange"]
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
            variables={**VARIABLES, "id": 99},
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
        self.assertEqual(content["errors"][0]["message"], "Forbidden")

    def _post_empty(self, username="admin"):
        old_count = AnnotationFileRange.objects.count()
        response = self.gql_query(
            MUTATION, user=User.objects.get(username=username), variables=VARIABLES
        )
        self.assertResponseHasErrors(response)
        errors = json.loads(response.content)["errors"]
        self.assertEqual(AnnotationFileRange.objects.count(), old_count)
        self.assertEqual(
            errors[0]["message"], "Cannot delete range with finished tasks."
        )

    def test_post_owner_update(self):
        old_count = AnnotationFileRange.objects.count()
        response = self.gql_query(
            MUTATION, user=User.objects.get(username="admin"), variables=VARIABLES
        )
        self._assert_no_errors(response)
        self.assertEqual(AnnotationFileRange.objects.count(), old_count)
        item: AnnotationFileRange = AnnotationFileRange.objects.get(pk=3)
        self.assertEqual(item.first_file_index, 4)
        self.assertEqual(item.last_file_index, 5)
