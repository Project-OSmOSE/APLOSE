import json
from os.path import join

from django.conf import settings
from django.test import override_settings
from graphene_django.utils import GraphQLTestCase

from backend.api.models import SpectrogramAnalysis, Spectrogram

QUERY = """
mutation ($datasetName: String!, $datasetPath: String!, $legacy: Boolean, $name: String!, $path: String!) {
    importSpectrogramAnalysis(datasetName: $datasetName, datasetPath: $datasetPath, legacy: $legacy, name: $name, path: $path) {
        ok
    }
}
"""
BASE_VARIABLES = {
    "datasetName": "gliderSPAmsDemo",
    "datasetPath": "gliderSPAmsDemo",
    "legacy": True,
    "name": "4096_512_85",
    "path": join("processed", "spectrogram", "600_480", "4096_512_85"),
}
IMPORT_FIXTURES = settings.FIXTURE_DIRS[1] / "data" / "dataset" / "list_to_import"
LEGACY_IMPORT_FIXTURES = (
    settings.FIXTURE_DIRS[1] / "data" / "dataset" / "list_to_import" / "legacy"
)


class ImportSpectrogramAnalysisTestCase(GraphQLTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ["users", "dataset"]

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.query(QUERY, variables=BASE_VARIABLES)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected_not_staff(self):
        self.client.login(username="user1", password="osmose29")
        response = self.query(QUERY, variables=BASE_VARIABLES)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Forbidden")

    @override_settings(DATASET_IMPORT_FOLDER=LEGACY_IMPORT_FIXTURES / "good")
    def test_connected_legacy(self):
        previous_analysis_count = SpectrogramAnalysis.objects.count()
        previous_spectrogram_count = Spectrogram.analysis.through.objects.count()
        self.client.login(username="staff", password="osmose29")
        response = self.query(QUERY, variables=BASE_VARIABLES)
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)["data"]["importSpectrogramAnalysis"]
        self.assertTrue(content["ok"])

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
        self.assertEqual(analysis.name, "4096_512_85")
        self.assertEqual(
            analysis.path, join("processed", "spectrogram", "600_480", "4096_512_85")
        )
        self.assertTrue(analysis.legacy)

    @override_settings(
        DATASET_IMPORT_FOLDER=LEGACY_IMPORT_FIXTURES / "Dual_LF_HF_scale"
    )
    def test_connected_legacy_with_scale(self):
        previous_analysis_count = SpectrogramAnalysis.objects.count()
        previous_spectrogram_count = Spectrogram.analysis.through.objects.count()
        self.client.login(username="staff", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **BASE_VARIABLES,
                "path": join(
                    "processed", "spectrogram", "600_480", "4096_512_85_Dual_LF_HF"
                ),
            },
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)["data"]["importSpectrogramAnalysis"]
        self.assertTrue(content["ok"])

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
        self.assertEqual(
            analysis.legacy_configuration.multi_linear_frequency_scale.name,
            "dual_lf_hf",
        )
        self.assertEqual(
            analysis.legacy_configuration.multi_linear_frequency_scale.inner_scales.count(),
            2,
        )
