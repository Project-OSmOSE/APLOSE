import json

from django_extension.tests import ExtendedTestCase
from freezegun import freeze_time

from backend.api.models import AnnotationCampaign
from backend.api.tests.fixtures import ALL_FIXTURES
from backend.aplose.models import User

QUERY = """
mutation ($id: ID!) {
    archiveAnnotationCampaign(id: $id) {
        ok
        error {
            field
            messages
        }
    }
}
"""
BASE_VARIABLES = {"id": 1}


@freeze_time("2012-01-14 00:00:00")
class ArchiveAnnotationCampaignTestCase(ExtendedTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ["users", *ALL_FIXTURES]

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.gql_query(QUERY, variables=BASE_VARIABLES)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected_unknown(self):
        response = self.gql_query(
            QUERY, user=User.objects.get(username="admin"), variables={"id": 99}
        )
        content = json.loads(response.content)["data"]["archiveAnnotationCampaign"]
        self.assertEqual(content["error"]["messages"][0], "Does not exists")

    def test_connected_no_access(self):
        response = self.gql_query(
            QUERY, user=User.objects.get(username="user4"), variables=BASE_VARIABLES
        )
        content = json.loads(response.content)["data"]["archiveAnnotationCampaign"]
        self.assertEqual(content["error"]["messages"][0], "Permission denied")

    def test_connected_not_allowed(self):
        response = self.gql_query(
            QUERY, user=User.objects.get(username="user2"), variables=BASE_VARIABLES
        )
        content = json.loads(response.content)["data"]["archiveAnnotationCampaign"]
        self.assertEqual(content["error"]["messages"][0], "Permission denied")

    def _test_archive(self, username: str):
        campaign = AnnotationCampaign.objects.get(pk=1)

        for phase in campaign.phases.all():
            self.assertEqual(phase.is_open, True)
            self.assertIsNone(phase.ended_at)
            self.assertIsNone(phase.ended_by_id)

        response = self.gql_query(
            QUERY, user=User.objects.get(username=username), variables=BASE_VARIABLES
        )
        self.assertResponseNoErrors(response)

        campaign = AnnotationCampaign.objects.get(pk=1)
        self.assertTrue(campaign.archived)
        self.assertEqual(campaign.archived_by.username, username)

        for phase in campaign.phases.all():
            self.assertFalse(phase.is_open)
            self.assertEqual(phase.ended_at.isoformat(), "2012-01-14T00:00:00+00:00")
            self.assertEqual(phase.ended_by_id, campaign.archived_by_id)

    def test_connected_admin(self):
        self._test_archive("admin")

    def test_connected_owner(self):
        self._test_archive("user1")
