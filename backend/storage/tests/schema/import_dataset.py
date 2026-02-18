import json
from pathlib import Path

from django.conf import settings
from django.test import override_settings
from django_extension.tests import ExtendedTestCase

from backend.api.models import SpectrogramAnalysis, Spectrogram, Dataset
from backend.aplose.models import User

VOLUMES_ROOT = settings.FIXTURE_DIRS[1] / "data" / "dataset" / "list_to_import"
GOOD = Path("good")
LEGACY_GOOD = Path("legacy/good")

QUERY = """
mutation ($path: String!) {
    importDataset(path: $path) {
        ok
    }
}
"""
VARIABLES = {
    "path": "tp_osekit",
}
LEGACY_VARIABLES = {
    "path": "gliderSPAmsDemo",
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
        previous_analysis_count = SpectrogramAnalysis.objects.count()
        previous_spectrogram_count = Spectrogram.analysis.through.objects.count()

        response = self.gql_query(
            QUERY,
            variables=VARIABLES,
            user=User.objects.get(username="staff"),
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)["data"]["importDataset"]
        self.assertTrue(content["ok"])

        # Check amount of new data
        self.assertEqual(Dataset.objects.count(), previous_dataset_count + 1)
        self.assertEqual(
            SpectrogramAnalysis.objects.count(), previous_analysis_count + 1
        )
        self.assertEqual(
            Spectrogram.analysis.through.objects.count(),
            previous_spectrogram_count + 12,
        )

        # Check last dataset
        dataset: Dataset = Dataset.objects.order_by("pk").last()
        self.assertEqual(dataset.name, "tp_osekit")
        self.assertEqual(dataset.path, "tp_osekit")
        self.assertFalse(dataset.legacy)
        self.assertEqual(dataset.spectrogram_analysis.count(), 1)

    @override_settings(DATASET_EXPORT_PATH=LEGACY_GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_legacy(self):
        previous_dataset_count = Dataset.objects.count()
        previous_analysis_count = SpectrogramAnalysis.objects.count()
        previous_spectrogram_count = Spectrogram.analysis.through.objects.count()

        response = self.gql_query(
            QUERY,
            variables=LEGACY_VARIABLES,
            user=User.objects.get(username="staff"),
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)["data"]["importDataset"]
        self.assertTrue(content["ok"])

        # Check amount of new data
        self.assertEqual(Dataset.objects.count(), previous_dataset_count + 1)
        self.assertEqual(
            SpectrogramAnalysis.objects.count(), previous_analysis_count + 1
        )
        self.assertEqual(
            Spectrogram.analysis.through.objects.count(),
            previous_spectrogram_count + 10,
        )

        # Check last dataset
        dataset: Dataset = Dataset.objects.order_by("pk").last()
        self.assertEqual(dataset.name, "gliderSPAmsDemo")
        self.assertEqual(dataset.path, "gliderSPAmsDemo")
        self.assertTrue(dataset.legacy)
        self.assertEqual(dataset.spectrogram_analysis.count(), 1)
