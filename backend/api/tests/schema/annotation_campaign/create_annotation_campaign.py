import json

from freezegun import freeze_time
from graphene_django.utils import GraphQLTestCase

from backend.api.models import AnnotationCampaign
from backend.api.tests.fixtures import ALL_FIXTURES

MUTATION = """
mutation (
    $name: String!
    $description: String
    $instructionsUrl: String
    $deadline: Date
    $allowImageTuning: Boolean
    $allowColormapTuning: Boolean
    $colormapDefault: String
    $colormapInvertedDefault: Boolean
    $datasetID: ID!
    $analysisIDs: [ID]!
) {
    createAnnotationCampaign(input: {
        name: $name
        description: $description
        instructionsUrl: $instructionsUrl
        deadline: $deadline
        allowImageTuning: $allowImageTuning
        allowColormapTuning: $allowColormapTuning
        colormapDefault: $colormapDefault
        colormapInvertedDefault: $colormapInvertedDefault
        dataset: $datasetID
        analysis: $analysisIDs
    }) {
        annotationCampaign {
            id
        }
        errors {
            field
            messages
        }
    }
}
"""
BASE_VARIABLES = {
    "name": "Test create campaign",
    "description": "Test create campaign desc",
    "deadline": "2022-01-30",
    "datasetID": 1,
    "analysisIDs": [1],
}


@freeze_time("2012-01-14 00:00:00")
class CreateAnnotationCampaignTestCase(GraphQLTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ["users", *ALL_FIXTURES]

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.query(MUTATION, variables=BASE_VARIABLES)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected(self):
        self.client.login(username="user1", password="osmose29")
        old_count = AnnotationCampaign.objects.count()
        response = self.query(MUTATION, variables=BASE_VARIABLES)
        self.assertResponseNoErrors(response)

        self.assertEqual(AnnotationCampaign.objects.count(), old_count + 1)
        campaign = AnnotationCampaign.objects.latest("id")
        content = json.loads(response.content)["data"]["createAnnotationCampaign"]
        self.assertEqual(content["annotationCampaign"]["id"], str(campaign.id))

        self.assertEqual(campaign.dataset.name, "gliderSPAmsDemo")
        self.assertEqual(list(campaign.analysis.values_list("id", flat=True)), [1])
        self.assertIsNone(campaign.confidence_set)
        self.assertIsNone(campaign.label_set)
        self.assertIsNone(campaign.archive)
        self.assertFalse(campaign.allow_point_annotation)
        self.assertEqual(campaign.created_at.isoformat(), "2012-01-14T00:00:00+00:00")

    def test_connected_post_only_required(self):
        self.client.login(username="user1", password="osmose29")
        old_count = AnnotationCampaign.objects.count()
        response = self.query(
            MUTATION,
            variables={
                "name": "Test create campaign",
                "datasetID": 1,
                "analysisIDs": [1],
            },
        )
        self.assertResponseNoErrors(response)

        self.assertEqual(AnnotationCampaign.objects.count(), old_count + 1)
        campaign = AnnotationCampaign.objects.latest("id")
        content = json.loads(response.content)["data"]["createAnnotationCampaign"]
        self.assertEqual(content["annotationCampaign"]["id"], str(campaign.id))

        self.assertEqual(campaign.dataset.name, "gliderSPAmsDemo")
        self.assertEqual(list(campaign.analysis.values_list("id", flat=True)), [1])
        self.assertIsNone(campaign.confidence_set)
        self.assertIsNone(campaign.label_set)
        self.assertIsNone(campaign.archive)
        self.assertFalse(campaign.allow_point_annotation)
        self.assertEqual(campaign.created_at.isoformat(), "2012-01-14T00:00:00+00:00")

    def test_connected_double_post(self):
        self.client.login(username="user1", password="osmose29")
        old_count = AnnotationCampaign.objects.count()
        response_1 = self.query(MUTATION, variables=BASE_VARIABLES)
        self.assertResponseNoErrors(response_1)

        response_2 = self.query(MUTATION, variables=BASE_VARIABLES)
        content = json.loads(response_2.content)["data"]["createAnnotationCampaign"]
        self.assertEqual(
            content["errors"][0]["messages"][0],
            "Annotation campaign with this Name already exists.",
        )

        self.assertEqual(AnnotationCampaign.objects.count(), old_count + 1)
