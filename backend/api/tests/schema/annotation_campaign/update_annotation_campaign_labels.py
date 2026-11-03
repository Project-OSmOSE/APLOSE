import json

from django_extension.tests import ExtendedTestCase
from freezegun import freeze_time

from backend.api.models import AnnotationCampaign
from backend.api.models.annotation.annotation_campaign import AnnotationCampaignLabel
from backend.api.tests.fixtures import ALL_FIXTURES
from backend.aplose.models import User

QUERY = """
mutation (
    $relationId: ID!
    $enableAcousticFeatures: Boolean!
) {
    updateAnnotationCampaignLabelAcousticFeatures(
        input: {
            id: $relationId,
            enableAcousticFeatures: $enableAcousticFeatures
        }
    ) {
        errors {
            field
            messages
        }
    }
}
"""


@freeze_time("2012-01-14 00:00:00")
class UpdateAnnotationCampaignLabelsTestCase(ExtendedTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ["users", *ALL_FIXTURES]

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.gql_query(
            QUERY, variables={"relationId": 99, "enableAcousticFeatures": True}
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected_unknown(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="admin"),
            variables={"relationId": 99, "enableAcousticFeatures": True},
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Not found")

    def test_connected_no_access(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="user4"),
            variables={
                "relationId": AnnotationCampaignLabel.objects.first().pk,
                "enableAcousticFeatures": True,
            },
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Not found")

    def test_connected_not_allowed(self):
        response = self.gql_query(
            QUERY, user=User.objects.get(username="user2"),
            variables={
                "relationId": AnnotationCampaignLabel.objects.first().pk,
                "enableAcousticFeatures": True,
            },
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Forbidden")

    def _test_update(self, username: str):
        relation = AnnotationCampaignLabel.objects.first()
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username=username),
            variables={
                "relationId": relation.pk,
                "enableAcousticFeatures": True,
            },
        )
        print(json.loads(response.content))
        self.assertResponseNoErrors(response)
        relation.refresh_from_db()
        self.assertTrue(relation.enable_acoustic_features)

        response = self.gql_query(
            QUERY,
            user=User.objects.get(username=username),
            variables={
                "relationId": relation.pk,
                "enableAcousticFeatures": False,
            },
        )
        self.assertResponseNoErrors(response)
        relation.refresh_from_db()
        self.assertFalse(relation.enable_acoustic_features)

    def test_connected_admin(self):
        self._test_update("admin")

    def test_connected_owner(self):
        self._test_update("user1")
