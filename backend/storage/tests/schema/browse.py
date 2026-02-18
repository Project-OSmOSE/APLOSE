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
query browse($path: String) {
    browse(path: $path) {
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
    def test_root(self):
        response = self.gql_query(
            QUERY,
            variables={"path": ""},
            user=User.objects.get(username="staff"),
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["browse"]
        self.assertEqual(len(content), 1)
        self.assertEqual(content[0]["name"], "tp_osekit")
        self.assertEqual(content[0]["path"], "tp_osekit")
        self.assertEqual(content[0]["importStatus"], "Available")

    @override_settings(DATASET_EXPORT_PATH=GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_dataset(self):
        response = self.gql_query(
            QUERY,
            variables={"path": "tp_osekit"},
            user=User.objects.get(username="staff"),
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["browse"]
        self.assertEqual(len(content), 1)
        self.assertEqual(content[0]["name"], "my_first_analysis")
        self.assertEqual(content[0]["path"], "tp_osekit/processed/my_first_analysis")
        self.assertEqual(content[0]["importStatus"], "Available")

    @override_settings(DATASET_EXPORT_PATH=LEGACY_GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_legacy_root(self):
        response = self.gql_query(
            QUERY,
            variables={"path": ""},
            user=User.objects.get(username="staff"),
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["browse"]
        self.assertEqual(len(content), 1)
        self.assertEqual(content[0]["name"], "gliderSPAmsDemo")
        self.assertEqual(content[0]["path"], "gliderSPAmsDemo")
        self.assertEqual(content[0]["importStatus"], "Available")

    @override_settings(DATASET_EXPORT_PATH=LEGACY_GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_legacy_dataset(self):
        response = self.gql_query(
            QUERY,
            variables={"path": "gliderSPAmsDemo"},
            user=User.objects.get(username="staff"),
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["browse"]
        self.assertEqual(len(content), 1)
        self.assertEqual(content[0]["name"], "4096_512_85")
        self.assertEqual(
            content[0]["path"],
            "gliderSPAmsDemo/processed/spectrogram/600_480/4096_512_85",
        )
        self.assertEqual(content[0]["importStatus"], "Available")
