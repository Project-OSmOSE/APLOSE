import json

from django_extension.tests import ExtendedTestCase

from backend.api.models import AnnotationFileRange
from backend.api.tests.fixtures import ALL_FIXTURES
from backend.aplose.models import User

MUTATION = """
mutation createFileRange($first: Int!, $last: Int!, $annotator: ID! $phase: ID!) {
    createFileRange(input: {
        firstFileIndex: $first
        lastFileIndex: $last
        annotationPhase: $phase
        annotator: $annotator
    }) {
        errors {
            messages
            field
        }
    }
}
"""
VARIABLES = {
    "first": 1,
    "last": 3,
    "annotator": 4,
    "phase": 1,
}


class CreateAnnotationFileRangeTestCase(ExtendedTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ALL_FIXTURES

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def _assert_no_errors(self, response):
        content = json.loads(response.content)["data"]["createFileRange"]
        self.assertEqual(response.status_code, 200, content)
        errors = [e for e in content["errors"] if e != []]
        self.assertEqual(len(errors), 0, content)

    def _assert_has_errors(self, response):
        content = json.loads(response.content)["data"]["createFileRange"]
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
            variables={**VARIABLES, "phase": 99},
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

    def test_create_owner(self):
        old_count = AnnotationFileRange.objects.count()
        response = self.gql_query(
            MUTATION,
            user=User.objects.get(username="admin"),
            variables=VARIABLES,
        )
        self._assert_no_errors(response)
        self.assertEqual(AnnotationFileRange.objects.count(), old_count + 1)

    def test_create_owner_duplicate(self):
        old_count = AnnotationFileRange.objects.count()
        response = self.gql_query(
            MUTATION,
            user=User.objects.get(username="admin"),
            variables={
                "first": 6,
                "last": 9,
                "annotator": 4,
                "phase": 1,
            },
        )
        self._assert_no_errors(response)
        self.assertEqual(AnnotationFileRange.objects.count(), old_count)

    def test_create_owner_bellow_range(self):
        old_count = AnnotationFileRange.objects.count()
        response = self.gql_query(
            MUTATION,
            user=User.objects.get(username="admin"),
            variables={
                "first": -2,
                "last": -1,
                "annotator": 4,
                "phase": 1,
            },
        )
        self._assert_has_errors(response)
        new_item_errors = json.loads(response.content)["data"]["createFileRange"][
            "errors"
        ]
        first_file_index_error = [
            e for e in new_item_errors if e["field"] == "firstFileIndex"
        ].pop()
        last_file_index_error = [
            e for e in new_item_errors if e["field"] == "lastFileIndex"
        ].pop()
        self.assertEqual(
            first_file_index_error["messages"][0],
            "Ensure this value is greater than or equal to 0.",
        )
        self.assertEqual(
            last_file_index_error["messages"][0],
            "Ensure this value is greater than or equal to 0.",
        )
        self.assertEqual(AnnotationFileRange.objects.count(), old_count)

    def test_create_owner_over_range(self):
        old_count = AnnotationFileRange.objects.count()
        response = self.gql_query(
            MUTATION,
            user=User.objects.get(username="admin"),
            variables={
                "first": 20,
                "last": 32,
                "annotator": 4,
                "phase": 1,
            },
        )
        self._assert_has_errors(response)
        new_item_errors = json.loads(response.content)["data"]["createFileRange"][
            "errors"
        ]
        first_file_index_error = [
            e for e in new_item_errors if e["field"] == "firstFileIndex"
        ].pop()
        last_file_index_error = [
            e for e in new_item_errors if e["field"] == "lastFileIndex"
        ].pop()
        self.assertEqual(
            first_file_index_error["messages"][0],
            "Ensure this value is less than or equal to 10.",
        )
        self.assertEqual(
            last_file_index_error["messages"][0],
            "Ensure this value is less than or equal to 10.",
        )
        self.assertEqual(AnnotationFileRange.objects.count(), old_count)

    def test_create_owner_wrong_limit_sort(self):
        old_count = AnnotationFileRange.objects.count()
        response = self.gql_query(
            MUTATION,
            user=User.objects.get(username="admin"),
            variables={
                "first": 5,
                "last": 2,
                "annotator": 4,
                "phase": 1,
            },
        )
        self._assert_has_errors(response)
        new_item_errors = json.loads(response.content)["data"]["createFileRange"][
            "errors"
        ]
        last_file_index_error = [
            e for e in new_item_errors if e["field"] == "lastFileIndex"
        ].pop()
        self.assertEqual(
            last_file_index_error["messages"][0],
            "Ensure this value is greater than or equal to 5.",
        )
        self.assertEqual(AnnotationFileRange.objects.count(), old_count)

    def test_create_owner_initial_overlapping(self):
        old_count = AnnotationFileRange.objects.count()
        response = self.gql_query(
            MUTATION,
            user=User.objects.get(username="admin"),
            variables={
                "first": 7,
                "last": 8,
                "annotator": 4,
                "phase": 1,
            },
        )
        self._assert_no_errors(response)
        self.assertEqual(AnnotationFileRange.objects.count(), old_count)
        item: AnnotationFileRange = AnnotationFileRange.objects.get(pk=3)
        self.assertEqual(item.first_file_index, 6)
        self.assertEqual(item.last_file_index, 9)

    def test_create_owner_new_overlapping(self):
        old_count = AnnotationFileRange.objects.count()
        response = self.gql_query(
            MUTATION,
            user=User.objects.get(username="admin"),
            variables={
                "first": 4,
                "last": 10,
                "annotator": 4,
                "phase": 1,
            },
        )
        self._assert_no_errors(response)
        self.assertEqual(AnnotationFileRange.objects.count(), old_count)
        item: AnnotationFileRange = AnnotationFileRange.objects.get(
            annotator_id=4, annotation_phase_id=1
        )
        self.assertEqual(item.first_file_index, 4)
        self.assertEqual(item.last_file_index, 10)

    def test_create_owner_sibling(self):
        old_count = AnnotationFileRange.objects.count()
        response = self.gql_query(
            MUTATION,
            user=User.objects.get(username="admin"),
            variables={
                "first": 4,
                "last": 5,
                "annotator": 4,
                "phase": 1,
            },
        )
        self._assert_no_errors(response)
        self.assertEqual(AnnotationFileRange.objects.count(), old_count)
        item: AnnotationFileRange = AnnotationFileRange.objects.get(
            annotator_id=4, annotation_phase_id=1
        )
        self.assertEqual(item.first_file_index, 4)
        self.assertEqual(item.last_file_index, 9)
