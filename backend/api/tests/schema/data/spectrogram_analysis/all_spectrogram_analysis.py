import json

from graphene_django.utils import GraphQLTestCase

from backend.api.models import Dataset
from backend.api.tests.fixtures import ALL_FIXTURES

QUERY = """
query ($datasetID: ID, $annotationCampaignID: ID) {
    allSpectrogramAnalysis(orderBy: "-createdAt", dataset: $datasetID, annotationCampaigns_Id: $annotationCampaignID) {
        results {
            id
            name
            description
            createdAt
            legacy
            spectrograms {
                totalCount
                start
                end
            }
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
FOR_CAMPAIGN_VARIABLE = {
    "annotationCampaignID": 1,
}


class AllSpectrogramAnalysisTestCase(GraphQLTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ALL_FIXTURES

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.query(QUERY, variables=FOR_DATASET_VARIABLE)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected_dataset_filter(self):
        self.client.login(username="user1", password="osmose29")
        response = self.query(QUERY, variables=FOR_DATASET_VARIABLE)
        self.assertResponseNoErrors(response)

        dataset = Dataset.objects.get(pk=1)
        content = json.loads(response.content)["data"]["allSpectrogramAnalysis"][
            "results"
        ]
        self.assertEqual(len(content), dataset.spectrogram_analysis.count())
        self.assertEqual(content[0]["name"], "spectro_config1")
        self.assertEqual(content[0]["spectrograms"]["totalCount"], 11)
        self.assertEqual(
            content[0]["spectrograms"]["start"], "2012-10-03T10:00:00+00:00"
        )
        self.assertEqual(content[0]["spectrograms"]["end"], "2012-10-03T20:15:00+00:00")

    def test_connected_campaign_filter(self):
        self.client.login(username="user1", password="osmose29")
        response = self.query(QUERY, variables=FOR_CAMPAIGN_VARIABLE)
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allSpectrogramAnalysis"][
            "results"
        ]
        self.assertEqual(len(content), 1)
        self.assertEqual(content[0]["name"], "spectro_config1")
        self.assertEqual(content[0]["spectrograms"]["totalCount"], 11)
        self.assertEqual(
            content[0]["spectrograms"]["start"], "2012-10-03T10:00:00+00:00"
        )
        self.assertEqual(content[0]["spectrograms"]["end"], "2012-10-03T20:15:00+00:00")
