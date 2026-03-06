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
LEGACY_GOOD_WITH_SCALES = Path("legacy/Dual_LF_HF_scale")

QUERY = """
mutation ($analysisPath: String, $datasetPath: String!) {
    importDataset(analysisPath: $analysisPath, datasetPath: $datasetPath) {
        dataset {
            id
        }
        analysis {
            id
        }
    }
  _debug {
    exceptions {
      stack
    }
  }
}
"""
VARIABLES = {
    "datasetPath": "tp_osekit",
}
LEGACY_VARIABLES = {
    "datasetPath": "gliderSPAmsDemo",
}
ANALYSIS_VARIABLES = {
    "analysisPath": "processed/my_first_analysis",
    "datasetPath": "tp_osekit",
}
ANALYSIS_LEGACY_VARIABLES = {
    "analysisPath": "processed/spectrogram/600_480/4096_512_85",
    "datasetPath": "gliderSPAmsDemo",
}
ANALYSIS_LEGACY_VARIABLES_WITH_SCALES = {
    "analysisPath": "processed/spectrogram/600_480/4096_512_85_Dual_LF_HF",
    "datasetPath": "gliderSPAmsDemo",
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
        self.assertIsNotNone(content["dataset"])

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
        self.assertEqual(content["dataset"]["id"], str(dataset.id))
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
        self.assertIsNotNone(content["dataset"])

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
        self.assertEqual(content["dataset"]["id"], str(dataset.id))
        self.assertEqual(dataset.name, "gliderSPAmsDemo")
        self.assertEqual(dataset.path, "gliderSPAmsDemo")
        self.assertTrue(dataset.legacy)
        self.assertEqual(dataset.spectrogram_analysis.count(), 1)

    @override_settings(DATASET_EXPORT_PATH=GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_analysis(self):
        previous_analysis_count = SpectrogramAnalysis.objects.count()
        previous_spectrogram_count = Spectrogram.analysis.through.objects.count()

        response = self.gql_query(
            QUERY,
            variables=ANALYSIS_VARIABLES,
            user=User.objects.get(username="staff"),
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)["data"]["importDataset"]
        self.assertIsNotNone(content["analysis"])

        # Check amount of new data
        self.assertEqual(
            SpectrogramAnalysis.objects.count(), previous_analysis_count + 1
        )
        self.assertEqual(
            Spectrogram.analysis.through.objects.count(),
            previous_spectrogram_count + 12,
        )

        # Check last spectrogram analysis
        analysis: SpectrogramAnalysis = SpectrogramAnalysis.objects.order_by(
            "pk"
        ).last()
        self.assertEqual(content["analysis"]["id"], str(analysis.id))
        self.assertEqual(analysis.name, "my_first_analysis")
        self.assertEqual(analysis.path, "processed/my_first_analysis")
        self.assertFalse(analysis.legacy)

    @override_settings(DATASET_EXPORT_PATH=LEGACY_GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_analysis_legacy(self):
        previous_analysis_count = SpectrogramAnalysis.objects.count()
        previous_spectrogram_count = Spectrogram.analysis.through.objects.count()

        response = self.gql_query(
            QUERY,
            variables=ANALYSIS_LEGACY_VARIABLES,
            user=User.objects.get(username="staff"),
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)["data"]["importDataset"]
        self.assertIsNotNone(content["analysis"])

        # Check amount of new data
        self.assertEqual(
            SpectrogramAnalysis.objects.count(), previous_analysis_count + 1
        )
        self.assertEqual(
            Spectrogram.analysis.through.objects.count(),
            previous_spectrogram_count + 10,
        )

        # Check last spectrogram analysis
        analysis: SpectrogramAnalysis = SpectrogramAnalysis.objects.order_by(
            "pk"
        ).last()
        self.assertEqual(content["analysis"]["id"], str(analysis.id))
        self.assertEqual(analysis.name, "600_480/4096_512_85")
        self.assertEqual(analysis.path, "processed/spectrogram/600_480/4096_512_85")
        self.assertTrue(analysis.legacy)

    @override_settings(
        DATASET_EXPORT_PATH=LEGACY_GOOD_WITH_SCALES, VOLUMES_ROOT=VOLUMES_ROOT
    )
    def test_analysis_legacy_with_scales(self):
        previous_analysis_count = SpectrogramAnalysis.objects.count()
        previous_spectrogram_count = Spectrogram.analysis.through.objects.count()

        response = self.gql_query(
            QUERY,
            variables=ANALYSIS_LEGACY_VARIABLES_WITH_SCALES,
            user=User.objects.get(username="staff"),
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)["data"]["importDataset"]
        self.assertIsNotNone(content["analysis"])

        # Check amount of new data
        self.assertEqual(
            SpectrogramAnalysis.objects.count(), previous_analysis_count + 1
        )
        self.assertEqual(
            Spectrogram.analysis.through.objects.count(),
            previous_spectrogram_count + 10,
        )

        # Check scale
        analysis: SpectrogramAnalysis = SpectrogramAnalysis.objects.order_by(
            "pk"
        ).last()
        self.assertEqual(content["analysis"]["id"], str(analysis.id))
        self.assertEqual(
            analysis.legacy_configuration.multi_linear_frequency_scale.name,
            "dual_lf_hf",
        )
        self.assertEqual(
            analysis.legacy_configuration.multi_linear_frequency_scale.inner_scales.count(),
            2,
        )
