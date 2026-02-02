import json

from django.conf import settings
from django.test import override_settings
from django_extension.tests import ExtendedTestCase

from backend.api.models import Dataset, SpectrogramAnalysis, Spectrogram
from backend.aplose.models import User

QUERY = """
mutation ($name: String!, $path: String!, $legacy: Boolean) {
    importDataset(name: $name, path: $path, legacy: $legacy) {
        ok
    }
}
"""
BASE_VARIABLES = {"name": "gliderSPAmsDemo", "path": "gliderSPAmsDemo", "legacy": True}
IMPORT_FIXTURES = settings.FIXTURE_DIRS[1] / "data" / "dataset" / "list_to_import"
LEGACY_IMPORT_FIXTURES = (
    settings.FIXTURE_DIRS[1] / "data" / "dataset" / "list_to_import" / "legacy"
)


class ImportDatasetTestCase(ExtendedTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ["users"]

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.gql_query(QUERY, variables=BASE_VARIABLES)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected_not_staff(self):
        response = self.gql_query(
            QUERY, user=User.objects.get(username="user1"), variables=BASE_VARIABLES
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Forbidden")

    @override_settings(DATASET_IMPORT_FOLDER=LEGACY_IMPORT_FIXTURES / "good")
    def test_connected_legacy(self):
        previous_dataset_count = Dataset.objects.count()
        previous_analysis_count = SpectrogramAnalysis.objects.count()
        previous_spectrogram_count = Spectrogram.analysis.through.objects.count()
        response = self.gql_query(
            QUERY, user=User.objects.get(username="staff"), variables=BASE_VARIABLES
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

    @override_settings(DATASET_IMPORT_FOLDER=LEGACY_IMPORT_FIXTURES / "missing_file")
    def test_connected_legacy_missing_file(self):
        previous_dataset_count = Dataset.objects.count()
        previous_analysis_count = SpectrogramAnalysis.objects.count()
        previous_spectrogram_count = Spectrogram.analysis.through.objects.count()
        response = self.gql_query(
            QUERY, user=User.objects.get(username="staff"), variables=BASE_VARIABLES
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Missing datasets.csv file")

        # Check amount of data hasn't change
        self.assertEqual(Dataset.objects.count(), previous_dataset_count)
        self.assertEqual(SpectrogramAnalysis.objects.count(), previous_analysis_count)
        self.assertEqual(
            Spectrogram.analysis.through.objects.count(), previous_spectrogram_count
        )

    @override_settings(
        DATASET_IMPORT_FOLDER=LEGACY_IMPORT_FIXTURES / "missing_csv_columns"
    )
    def test_connected_legacy_missing_column(self):
        previous_dataset_count = Dataset.objects.count()
        previous_analysis_count = SpectrogramAnalysis.objects.count()
        previous_spectrogram_count = Spectrogram.analysis.through.objects.count()
        response = self.gql_query(
            QUERY, user=User.objects.get(username="staff"), variables=BASE_VARIABLES
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Dataset not found")

        # Check amount of data hasn't change
        self.assertEqual(Dataset.objects.count(), previous_dataset_count)
        self.assertEqual(SpectrogramAnalysis.objects.count(), previous_analysis_count)
        self.assertEqual(
            Spectrogram.analysis.through.objects.count(), previous_spectrogram_count
        )

    @override_settings(
        DATASET_IMPORT_FOLDER=LEGACY_IMPORT_FIXTURES / "Dual_LF_HF_scale"
    )
    def test_connected_legacy_with_scale(self):
        previous_dataset_count = Dataset.objects.count()
        previous_analysis_count = SpectrogramAnalysis.objects.count()
        previous_spectrogram_count = Spectrogram.analysis.through.objects.count()
        response = self.gql_query(
            QUERY, user=User.objects.get(username="staff"), variables=BASE_VARIABLES
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

        # Check scale
        analysis: SpectrogramAnalysis = SpectrogramAnalysis.objects.order_by(
            "pk"
        ).last()
        self.assertEqual(
            analysis.legacy_configuration.multi_linear_frequency_scale.name,
            "dual_lf_hf",
        )
        self.assertEqual(
            analysis.legacy_configuration.multi_linear_frequency_scale.inner_scales.count(),
            2,
        )
