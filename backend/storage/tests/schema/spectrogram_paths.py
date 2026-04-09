import json
from pathlib import Path

from django.conf import settings
from django.test import override_settings
from django_extension.tests import ExtendedTestCase

from backend.api.models import Spectrogram, SpectrogramAnalysis
from backend.aplose.models import User
from .import_dataset import (
    QUERY as IMPORT_QUERY,
    ANALYSIS_VARIABLES as IMPORT_VARIABLES,
    ANALYSIS_LEGACY_VARIABLES as IMPORT_LEGACY_VARIABLES,
)

VOLUMES_ROOT = settings.FIXTURE_DIRS[1] / "data" / "dataset" / "list_to_import"
GOOD = Path("good")
LEGACY_GOOD = Path("legacy/good")

QUERY = """
query ($spectrogramID: ID!, $analysisID: ID!) {
    spectrogramPaths(spectrogramId: $spectrogramID, analysisId: $analysisID) {
        audioPath
        spectrogramPath
    }
}
"""
DEFAULT_VARIABLES = {
    "spectrogramID": "1",
    "analysisID": "1",
}


class SpectrogramPathsTestCase(ExtendedTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ["users"]

    def test_not_connected(self):
        response = self.gql_query(QUERY, variables=DEFAULT_VARIABLES)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected_empty_user(self):
        response = self.gql_query(
            QUERY,
            variables=DEFAULT_VARIABLES,
            user=User.objects.get(username="user4"),
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(
            content["errors"][0]["message"], "No Spectrogram matches the given query."
        )

    @override_settings(DATASET_EXPORT_PATH=GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test(self):
        staff = User.objects.get(username="staff")
        import_response = self.gql_query(
            IMPORT_QUERY, variables=IMPORT_VARIABLES, user=staff
        )
        import_content = json.loads(import_response.content)["data"]["importData"]

        analysis = SpectrogramAnalysis.objects.get(pk=import_content["analysis"]["id"])
        spectrogram = analysis.spectrograms.first()
        response = self.gql_query(
            QUERY,
            variables={
                "analysisID": analysis.id,
                "spectrogramID": spectrogram.id,
            },
            user=staff,
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["spectrogramPaths"]
        self.assertEqual(
            content["audioPath"],
            "/backend/static/good/tp_osekit/data/audio/original/channelA_2022_07_17_00_25_46_seg000.wav",
        )
        self.assertEqual(
            content["spectrogramPath"],
            "/backend/static/good/tp_osekit/processed/my_first_analysis/spectrogram/2022_07_17_00_25_46_000000+0000.png",
        )

    @override_settings(DATASET_EXPORT_PATH=LEGACY_GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_legacy(self):
        staff = User.objects.get(username="staff")
        import_response = self.gql_query(
            IMPORT_QUERY, variables=IMPORT_LEGACY_VARIABLES, user=staff
        )
        import_content = json.loads(import_response.content)["data"]["importData"]

        analysis = SpectrogramAnalysis.objects.get(pk=import_content["analysis"]["id"])
        spectrogram = analysis.spectrograms.first()
        response = self.gql_query(
            QUERY,
            variables={
                "analysisID": analysis.id,
                "spectrogramID": spectrogram.id,
            },
            user=staff,
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["spectrogramPaths"]
        self.assertEqual(
            content["audioPath"],
            "/backend/static/legacy/good/gliderSPAmsDemo/data/audio/600_480/29_30_280219_135150_250_HYDRO.wav",
        )
        self.assertEqual(
            content["spectrogramPath"],
            "/backend/static/legacy/good/gliderSPAmsDemo/processed/spectrogram/600_480/4096_512_85/image/29_30_280219_135150_250_HYDRO.png",
        )
