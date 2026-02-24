import json
from pathlib import Path

from django.conf import settings
from django.test import override_settings
from django_extension.tests import ExtendedTestCase

from backend.aplose.models import User

VOLUMES_ROOT = settings.FIXTURE_DIRS[1] / "data" / "dataset" / "list_to_import"
GOOD = Path("good")
LEGACY_GOOD = Path("legacy/good")

QUERY = """
query ($path: String!) {
    search(path: $path) {
        ... on FolderNode {
            __typename
            name
            path
        }
        ... on DatasetStorageNode {
            __typename
            name
            path
            importStatus
        }
        ... on AnalysisStorageNode {
            __typename
            name
            path
            importStatus
        }
    }
}
"""


class BrowseTestCase(ExtendedTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ["users"]

    def test_not_connected(self):
        response = self.gql_query(QUERY, variables={"path": ""})
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected_not_staff(self):
        response = self.gql_query(
            QUERY,
            variables={"path": ""},
            user=User.objects.get(username="user1"),
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Forbidden")

    @override_settings(DATASET_EXPORT_PATH=GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_absolute_path(self):
        response = self.gql_query(
            QUERY,
            variables={
                "path": r"C:\Users\morinel\IdeaProjects\osmose-app\backend\api\tests\fixtures\data\dataset\list_to_import\good\tp_osekit"
            },
            user=User.objects.get(username="staff"),
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["search"]
        self.assertIsNotNone(content)
        self.assertEqual(content["name"], "tp_osekit")
        self.assertEqual(content["path"], "tp_osekit")
        self.assertEqual(content["importStatus"], "Available")

    @override_settings(DATASET_EXPORT_PATH=GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_relative_path_before_root(self):
        response = self.gql_query(
            QUERY,
            variables={"path": r"\data\dataset\list_to_import\good\tp_osekit"},
            user=User.objects.get(username="staff"),
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["search"]
        self.assertIsNotNone(content)
        self.assertEqual(content["name"], "tp_osekit")
        self.assertEqual(content["path"], "tp_osekit")
        self.assertEqual(content["importStatus"], "Available")

    @override_settings(DATASET_EXPORT_PATH=GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_relative_path_root(self):
        response = self.gql_query(
            QUERY,
            variables={"path": r"good\tp_osekit"},
            user=User.objects.get(username="staff"),
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["search"]
        self.assertIsNotNone(content)
        self.assertEqual(content["name"], "tp_osekit")
        self.assertEqual(content["path"], "tp_osekit")
        self.assertEqual(content["importStatus"], "Available")

    @override_settings(DATASET_EXPORT_PATH=GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_relative_path_after_root(self):
        response = self.gql_query(
            QUERY,
            variables={"path": r"tp_osekit"},
            user=User.objects.get(username="staff"),
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["search"]
        self.assertIsNotNone(content)
        self.assertEqual(content["name"], "tp_osekit")
        self.assertEqual(content["path"], "tp_osekit")
        self.assertEqual(content["importStatus"], "Available")

    @override_settings(DATASET_EXPORT_PATH=GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_path_to_dataset_json(self):
        response = self.gql_query(
            QUERY,
            variables={"path": r"tp_osekit/dataset.json"},
            user=User.objects.get(username="staff"),
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["search"]
        self.assertIsNotNone(content)
        self.assertEqual(content["name"], "tp_osekit")
        self.assertEqual(content["path"], "tp_osekit")
        self.assertEqual(content["importStatus"], "Available")

    @override_settings(DATASET_EXPORT_PATH=GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_invalid_path(self):
        response = self.gql_query(
            QUERY,
            variables={"path": r"invalid"},
            user=User.objects.get(username="staff"),
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["search"]
        self.assertIsNone(content)

    @override_settings(DATASET_EXPORT_PATH=GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_path_folder_to_dataset_json(self):
        response = self.gql_query(
            QUERY,
            variables={"path": r"dataset.json"},
            user=User.objects.get(username="staff"),
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["search"]
        self.assertIsNone(content)

    @override_settings(DATASET_EXPORT_PATH=LEGACY_GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_path_legacy_to_dataset_json(self):
        response = self.gql_query(
            QUERY,
            variables={"path": r"gliderSPAmsDemo/dataset.json"},
            user=User.objects.get(username="staff"),
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["search"]
        self.assertIsNone(content)
