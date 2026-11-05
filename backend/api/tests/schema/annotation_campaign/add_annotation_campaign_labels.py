import json

from django_extension.tests import ExtendedTestCase
from freezegun import freeze_time

from backend.api.models import AnnotationCampaign
from backend.api.tests.fixtures import ALL_FIXTURES
from backend.aplose.models import User

QUERY = """
mutation (
    $campaignID: ID!
    $labels: [AnnotationCampaignLabelInput]!
) {
    addAnnotationCampaignLabels(
        input: {
            campaignId: $campaignID,
            list: $labels
        }
    ) {
        errors {
            field
            messages
        }
    }
}
"""
BASE_VARIABLES = {
    "campaignID": 1,
    "labels": [],
}


@freeze_time("2012-01-14 00:00:00")
class AddAnnotationCampaignLabelsTestCase(ExtendedTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ["users", *ALL_FIXTURES]

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.gql_query(QUERY, variables=BASE_VARIABLES)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected_unknown(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="admin"),
            variables={**BASE_VARIABLES, "campaignID": 99},
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Not found")

    def test_connected_no_access(self):
        response = self.gql_query(
            QUERY, user=User.objects.get(username="user4"), variables=BASE_VARIABLES
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Not found")

    def test_connected_not_allowed(self):
        response = self.gql_query(
            QUERY, user=User.objects.get(username="user2"), variables=BASE_VARIABLES
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Forbidden")

    def _test_update(self, username: str):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username=username),
            variables={
                **BASE_VARIABLES,
                "confidenceSetID": None,
                "labels": [
                    {
                        "enableAcousticFeatures": True,
                        "annotationCampaign": "1",
                        "label": "6",
                    },
                    {
                        "enableAcousticFeatures": False,
                        "annotationCampaign": "1",
                        "label": "7",
                    },
                ],
            },
        )
        self.assertResponseNoErrors(response)
        campaign = AnnotationCampaign.objects.get(pk=1)
        self.assertEqual(
            list(
                campaign.annotationcampaignlabel_set.filter(
                    enable_acoustic_features=True
                ).values_list("label__sound__english_name", flat=True)
            ),
            ["Dcall"],
        )
        self.assertEqual(campaign.labels.count(), 2)

    def test_connected_admin(self):
        self._test_update("admin")

    def test_connected_owner(self):
        self._test_update("user1")
