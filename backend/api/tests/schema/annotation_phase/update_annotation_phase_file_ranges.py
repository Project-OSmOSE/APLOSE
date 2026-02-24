import json

from django_extension.tests import ExtendedTestCase

from backend.api.models import AnnotationFileRange
from backend.api.tests.fixtures import ALL_FIXTURES
from backend.aplose.models import User

MUTATION = """
mutation (
    $campaignID: ID!
    $phaseType: AnnotationPhaseType!
    $fileRanges: [AnnotationFileRangeInput]!
    $force: Boolean
) {
    updateAnnotationPhaseFileRanges(
        campaignId: $campaignID
        phaseType: $phaseType
        fileRanges: $fileRanges
        force: $force
    ) {
        errors {
            messages
            field
        }
    }
}
"""
VARIABLES = {"campaignID": 1, "phaseType": "Annotation", "fileRanges": []}
existing_ranges = [
    {
        "id": 1,
        "firstFileIndex": 0,
        "lastFileIndex": 5,
        "annotatorId": 1,
    },
    {
        "id": 3,
        "firstFileIndex": 6,
        "lastFileIndex": 9,
        "annotatorId": 4,
    },
]
basic_create_range = {
    "firstFileIndex": 1,
    "lastFileIndex": 3,
    "annotatorId": 4,
}


class UpdateAnnotationPhaseFileRangesTestCase(ExtendedTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ALL_FIXTURES

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def _assert_no_errors(self, response):
        content = json.loads(response.content)["data"][
            "updateAnnotationPhaseFileRanges"
        ]
        self.assertEqual(response.status_code, 200, content)
        errors = [e for e in content["errors"] if e != []]
        self.assertEqual(len(errors), 0, content)

    def _assert_has_errors(self, response):
        content = json.loads(response.content)["data"][
            "updateAnnotationPhaseFileRanges"
        ]
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

    def test_post_admin_empty(self):
        self._post_empty()

    def test_post_owner_empty(self):
        self._post_empty()

    def test_post_owner_add(self):
        old_count = AnnotationFileRange.objects.count()
        response = self.gql_query(
            MUTATION,
            user=User.objects.get(username="admin"),
            variables={
                **VARIABLES,
                "fileRanges": existing_ranges + [basic_create_range],
            },
        )
        self._assert_no_errors(response)
        self.assertEqual(AnnotationFileRange.objects.count(), old_count + 1)

    def test_post_owner_duplicate(self):
        old_count = AnnotationFileRange.objects.count()
        response = self.gql_query(
            MUTATION,
            user=User.objects.get(username="admin"),
            variables={
                **VARIABLES,
                "fileRanges": existing_ranges
                + [
                    {
                        "firstFileIndex": 6,
                        "lastFileIndex": 9,
                        "annotatorId": 4,
                    }
                ],
            },
        )
        self._assert_no_errors(response)
        self.assertEqual(AnnotationFileRange.objects.count(), old_count)

    def test_post_owner_bellow_range(self):
        old_count = AnnotationFileRange.objects.count()
        response = self.gql_query(
            MUTATION,
            user=User.objects.get(username="admin"),
            variables={
                **VARIABLES,
                "fileRanges": existing_ranges
                + [
                    {
                        "firstFileIndex": -2,
                        "lastFileIndex": -1,
                        "annotatorId": 4,
                    }
                ],
            },
        )
        self._assert_has_errors(response)
        new_item_errors = json.loads(response.content)["data"][
            "updateAnnotationPhaseFileRanges"
        ]["errors"][2]
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

    def test_post_owner_over_range(self):
        old_count = AnnotationFileRange.objects.count()
        response = self.gql_query(
            MUTATION,
            user=User.objects.get(username="admin"),
            variables={
                **VARIABLES,
                "fileRanges": existing_ranges
                + [
                    {
                        "firstFileIndex": 20,
                        "lastFileIndex": 32,
                        "annotatorId": 4,
                    }
                ],
            },
        )
        self._assert_has_errors(response)
        new_item_errors = json.loads(response.content)["data"][
            "updateAnnotationPhaseFileRanges"
        ]["errors"][2]
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

    def test_post_owner_wrong_limit_sort(self):
        old_count = AnnotationFileRange.objects.count()
        response = self.gql_query(
            MUTATION,
            user=User.objects.get(username="admin"),
            variables={
                **VARIABLES,
                "fileRanges": existing_ranges
                + [
                    {
                        "firstFileIndex": 5,
                        "lastFileIndex": 2,
                        "annotatorId": 4,
                    }
                ],
            },
        )
        self._assert_has_errors(response)
        new_item_errors = json.loads(response.content)["data"][
            "updateAnnotationPhaseFileRanges"
        ]["errors"][2]
        last_file_index_error = [
            e for e in new_item_errors if e["field"] == "lastFileIndex"
        ].pop()
        self.assertEqual(
            last_file_index_error["messages"][0],
            "Ensure this value is greater than or equal to 5.",
        )
        self.assertEqual(AnnotationFileRange.objects.count(), old_count)

    def test_post_owner_initial_overlapping(self):
        old_count = AnnotationFileRange.objects.count()
        response = self.gql_query(
            MUTATION,
            user=User.objects.get(username="admin"),
            variables={
                **VARIABLES,
                "fileRanges": existing_ranges
                + [
                    {
                        "firstFileIndex": 7,
                        "lastFileIndex": 8,
                        "annotatorId": 4,
                    }
                ],
            },
        )
        self._assert_no_errors(response)
        self.assertEqual(AnnotationFileRange.objects.count(), old_count)
        item: AnnotationFileRange = AnnotationFileRange.objects.get(pk=3)
        self.assertEqual(item.first_file_index, 6)
        self.assertEqual(item.last_file_index, 9)

    def test_post_owner_new_overlapping(self):
        old_count = AnnotationFileRange.objects.count()
        response = self.gql_query(
            MUTATION,
            user=User.objects.get(username="admin"),
            variables={
                **VARIABLES,
                "fileRanges": existing_ranges
                + [
                    {
                        "firstFileIndex": 4,
                        "lastFileIndex": 10,
                        "annotatorId": 4,
                    }
                ],
            },
        )
        self._assert_no_errors(response)
        self.assertEqual(AnnotationFileRange.objects.count(), old_count)
        item: AnnotationFileRange = AnnotationFileRange.objects.order_by("id").last()
        self.assertEqual(item.first_file_index, 4)
        self.assertEqual(item.last_file_index, 10)

    def test_post_owner_sibling(self):
        old_count = AnnotationFileRange.objects.count()
        response = self.gql_query(
            MUTATION,
            user=User.objects.get(username="admin"),
            variables={
                **VARIABLES,
                "fileRanges": existing_ranges
                + [
                    {
                        "firstFileIndex": 4,
                        "lastFileIndex": 5,
                        "annotatorId": 4,
                    }
                ],
            },
        )
        self._assert_no_errors(response)
        self.assertEqual(AnnotationFileRange.objects.count(), old_count)
        item: AnnotationFileRange = AnnotationFileRange.objects.order_by("id").last()
        self.assertEqual(item.first_file_index, 4)
        self.assertEqual(item.last_file_index, 9)

    def test_post_owner_update(self):
        old_count = AnnotationFileRange.objects.count()
        response = self.gql_query(
            MUTATION,
            user=User.objects.get(username="admin"),
            variables={
                **VARIABLES,
                "fileRanges": existing_ranges
                + [
                    {
                        "id": 3,
                        "firstFileIndex": 4,
                        "lastFileIndex": 5,
                        "annotatorId": 4,
                    }
                ],
            },
        )
        self._assert_no_errors(response)
        self.assertEqual(AnnotationFileRange.objects.count(), old_count)
        item: AnnotationFileRange = AnnotationFileRange.objects.get(pk=3)
        self.assertEqual(item.first_file_index, 4)
        self.assertEqual(item.last_file_index, 5)

    def test_post_owner_delete_all(self):
        old_count = AnnotationFileRange.objects.count()
        response = self.gql_query(
            MUTATION,
            user=User.objects.get(username="admin"),
            variables={**VARIABLES, "campaignID": 2},
        )
        self.assertResponseNoErrors(response)
        self.assertEqual(AnnotationFileRange.objects.count(), old_count - 2)

    def test_post_owner_delete_one(self):
        old_count = AnnotationFileRange.objects.count()
        response = self.gql_query(
            MUTATION,
            user=User.objects.get(username="admin"),
            variables={
                **VARIABLES,
                "fileRanges": [existing_ranges[0]],
            },
        )
        self.assertResponseNoErrors(response)
        self.assertEqual(AnnotationFileRange.objects.count(), old_count - 1)
        self.assertTrue(
            AnnotationFileRange.objects.filter(id=existing_ranges[0]["id"]).exists()
        )
        self.assertFalse(
            AnnotationFileRange.objects.filter(id=existing_ranges[1]["id"]).exists()
        )
