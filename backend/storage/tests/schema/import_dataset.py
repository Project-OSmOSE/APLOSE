import json
from pathlib import Path

from django.conf import settings
from django.test import override_settings
from django_extension.tests import ExtendedTestCase
from pygments.styles.dracula import background

from backend.api.models import Dataset
from backend.aplose.models import User
from backend.background_tasks.types import ImportAnalysisBackgroundTask

VOLUMES_ROOT = settings.FIXTURE_DIRS[1] / "data" / "dataset" / "list_to_import"
GOOD = Path("good")
LEGACY_GOOD = Path("legacy/good")
LEGACY_GOOD_WITH_SCALES = Path("legacy/Dual_LF_HF_scale")

QUERY = """
mutation ($path: String!) {
    importData(path: $path) {
        dataset {
            id
        }
        analysisResult {
            path
            backgroundTaskId
        }
    }
}
"""
VARIABLES = {
    "path": "tp_osekit",
}
LEGACY_VARIABLES = {
    "path": "gliderSPAmsDemo",
}
ANALYSIS_VARIABLES = {
    "path": "tp_osekit/processed/my_first_analysis",
}
ANALYSIS_LEGACY_VARIABLES = {
    "path": "gliderSPAmsDemo/processed/spectrogram/600_480/4096_512_85",
}
ANALYSIS_LEGACY_VARIABLES_WITH_SCALES = {
    "path": "gliderSPAmsDemo/processed/spectrogram/600_480/4096_512_85_Dual_LF_HF",
}


class ImportDatasetTestCase(ExtendedTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ["users"]

    def test_not_connected(self):
        response = self.gql_query(QUERY, variables=VARIABLES)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected_not_staff(self):
        response = self.gql_query(
            QUERY,
            variables=VARIABLES,
            user=User.objects.get(username="user1"),
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Forbidden")

    @override_settings(DATASET_EXPORT_PATH=GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test(self):
        previous_dataset_count = Dataset.objects.count()

        response = self.gql_query(
            QUERY,
            variables=VARIABLES,
            user=User.objects.get(username="staff"),
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)["data"]["importData"]
        self.assertIsNotNone(content["dataset"])

        # Check amount of new data
        self.assertEqual(Dataset.objects.count(), previous_dataset_count + 1)

        # Check last dataset
        dataset: Dataset = Dataset.objects.order_by("pk").last()
        self.assertEqual(content["dataset"]["id"], str(dataset.id))
        self.assertEqual(dataset.name, "tp_osekit")
        self.assertEqual(dataset.path, "tp_osekit")
        self.assertFalse(dataset.legacy)

    @override_settings(DATASET_EXPORT_PATH=LEGACY_GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_legacy(self):
        previous_dataset_count = Dataset.objects.count()

        response = self.gql_query(
            QUERY,
            variables=LEGACY_VARIABLES,
            user=User.objects.get(username="staff"),
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)["data"]["importData"]
        self.assertIsNotNone(content["dataset"])

        # Check amount of new data
        self.assertEqual(Dataset.objects.count(), previous_dataset_count + 1)

        # Check last dataset
        dataset: Dataset = Dataset.objects.order_by("pk").last()
        self.assertEqual(content["dataset"]["id"], str(dataset.id))
        self.assertEqual(dataset.name, "gliderSPAmsDemo")
        self.assertEqual(dataset.path, "gliderSPAmsDemo")
        self.assertTrue(dataset.legacy)

    @override_settings(DATASET_EXPORT_PATH=GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_analysis(self):
        response = self.gql_query(
            QUERY,
            variables=ANALYSIS_VARIABLES,
            user=User.objects.get(username="staff"),
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)["data"]["importData"]
        self.assertIsNotNone(content["analysisResult"])
        self.assertIsNotNone(
            ImportAnalysisBackgroundTask.get(
                content["analysisResult"][0]["backgroundTaskId"]
            )
        )

    @override_settings(DATASET_EXPORT_PATH=LEGACY_GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_analysis_legacy(self):
        response = self.gql_query(
            QUERY,
            variables=ANALYSIS_LEGACY_VARIABLES,
            user=User.objects.get(username="staff"),
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)["data"]["importData"]
        self.assertIsNotNone(content["analysisResult"])
        self.assertIsNotNone(
            ImportAnalysisBackgroundTask.get(
                content["analysisResult"][0]["backgroundTaskId"]
            )
        )

    @override_settings(
        DATASET_EXPORT_PATH=LEGACY_GOOD_WITH_SCALES, VOLUMES_ROOT=VOLUMES_ROOT
    )
    def test_analysis_legacy_with_scales(self):

        response = self.gql_query(
            QUERY,
            variables=ANALYSIS_LEGACY_VARIABLES_WITH_SCALES,
            user=User.objects.get(username="staff"),
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)["data"]["importData"]
        self.assertIsNotNone(content["analysisResult"])
        self.assertIsNotNone(
            ImportAnalysisBackgroundTask.get(
                content["analysisResult"][0]["backgroundTaskId"]
            )
        )
