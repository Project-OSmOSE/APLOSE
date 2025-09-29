import json

from freezegun import freeze_time
from graphene_django.utils import GraphQLTestCase

from backend.api.models import AnnotationCampaign
from backend.api.tests.fixtures import ALL_FIXTURES

QUERY = """
mutation (
    $campaignPk: PK!
    $labelsWithAcousticFeatures: [String]
    $labelSetPk: PK
    $confidenceSetPk: PK
    $allowPointAnnotation: Boolean
     ) {
    updateAnnotationCampaign(
        pk: $campaignPk
        labelsWithAcousticFeatures: $labelsWithAcousticFeatures
        labelSetPk: $labelSetPk
        confidenceSetPk: $confidenceSetPk
        allowPointAnnotation: $allowPointAnnotation
    ) {
        ok
    }
}
"""
BASE_VARIABLES = {
    "campaignPk": 1,
    "labelsWithAcousticFeatures": None,
    "labelSetPk": None,
    "confidenceSetPk": None,
    "allowPointAnnotation": None,
}


@freeze_time("2012-01-14 00:00:00")
class UpdateAnnotationCampaignTestCase(GraphQLTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ["users", *ALL_FIXTURES]

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.query(QUERY, variables=BASE_VARIABLES)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected_unknown(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(QUERY, variables={**BASE_VARIABLES, "campaignPk": 99})
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Not found")

    def test_connected_no_access(self):
        self.client.login(username="user4", password="osmose29")
        response = self.query(QUERY, variables=BASE_VARIABLES)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Not found")

    def test_connected_not_allowed(self):
        self.client.login(username="user2", password="osmose29")
        response = self.query(QUERY, variables=BASE_VARIABLES)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Forbidden")

    def _test_update(self, username: str):
        self.client.login(username=username, password="osmose29")

        response = self.query(
            QUERY,
            variables={
                **BASE_VARIABLES,
                "labelsWithAcousticFeatures": ["Dcall"],
                "labelSetPk": 2,
                "confidenceSetPk": -1,
                "allowPointAnnotation": True,
            },
        )
        self.assertResponseNoErrors(response)
        campaign = AnnotationCampaign.objects.get(pk=1)
        self.assertEqual(
            list(campaign.labels_with_acoustic_features.values_list("name", flat=True)),
            ["Dcall"],
        )
        self.assertEqual(campaign.label_set_id, 2)
        self.assertIsNone(campaign.confidence_set)
        self.assertTrue(campaign.allow_point_annotation)

    def test_connected_admin(self):
        self._test_update("admin")

    def test_connected_owner(self):
        self._test_update("user1")
