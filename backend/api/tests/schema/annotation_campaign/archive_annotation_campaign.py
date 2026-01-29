import json

from django_extension.tests import ExtendedTestCase
from freezegun import freeze_time
from graphene_django.utils import GraphQLTestCase

from backend.api.models import AnnotationCampaign, Archive
from backend.api.tests.fixtures import ALL_FIXTURES
from backend.aplose.models import User

QUERY = """
mutation ($id: ID!) {
    archiveAnnotationCampaign(id: $id) {
        ok
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
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected_unknown(self):
        response = self.gql_query(
            QUERY, user=User.objects.get(username="admin"), variables={"id": 99}
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

    def _test_archive(self, username: str):
        campaign = AnnotationCampaign.objects.get(pk=1)

        for phase in campaign.phases.all():
            self.assertEqual(phase.is_open, True)
            self.assertIsNone(phase.ended_at)
            self.assertIsNone(phase.ended_by_id)

        old_count = Archive.objects.count()
        response = self.gql_query(
            QUERY, user=User.objects.get(username=username), variables=BASE_VARIABLES
        )
        self.assertResponseNoErrors(response)

        self.assertEqual(Archive.objects.count(), old_count + 1)

        campaign = AnnotationCampaign.objects.get(pk=1)
        self.assertIsNotNone(campaign.archive)
        self.assertEqual(campaign.archive.by_user.username, username)

        for phase in campaign.phases.all():
            self.assertFalse(phase.is_open)
            self.assertEqual(phase.ended_at.isoformat(), "2012-01-14T00:00:00+00:00")
            self.assertEqual(phase.ended_by_id, campaign.archive.by_user_id)

    def test_connected_admin(self):
        self._test_archive("admin")

    def test_connected_owner(self):
        self._test_archive("user1")
