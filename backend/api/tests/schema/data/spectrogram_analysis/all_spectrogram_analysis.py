import json

from graphene_django.utils import GraphQLTestCase

from backend.api.models import Dataset
from backend.api.tests.fixtures import DATA_FIXTURES

QUERY = """
query ($datasetID: Decimal, $annotationCampaignID: Decimal) {
    allSpectrogramAnalysis(orderBy: "-createdAt", datasetId: $datasetID, annotationCampaigns_Id: $annotationCampaignID) {
        results {
            id
            name
            description
            createdAt
            legacy
            filesCount
            start
            end
            dataDuration
            fft {
                samplingFrequency
                nfft
                windowSize
                overlap
            }
        }
    }
}
"""
FOR_DATASET_VARIABLE = {
    "datasetID": 1,
}


class AllSpectrogramAnalysisTestCase(GraphQLTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ["users", *DATA_FIXTURES]

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.query(QUERY, variables=FOR_DATASET_VARIABLE)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected(self):
        self.client.login(username="user1", password="osmose29")
        response = self.query(QUERY, variables=FOR_DATASET_VARIABLE)
        self.assertResponseNoErrors(response)

        dataset = Dataset.objects.get(pk=1)
        content = json.loads(response.content)["data"]["allSpectrogramAnalysis"][
            "results"
        ]
        self.assertEqual(len(content), dataset.spectrogram_analysis.count())
        self.assertEqual(content[0]["name"], "spectro_config1")
        self.assertEqual(content[0]["filesCount"], 11)
        self.assertEqual(content[0]["start"], "2012-10-03T10:00:00+00:00")
        self.assertEqual(content[0]["end"], "2012-10-03T20:15:00+00:00")
