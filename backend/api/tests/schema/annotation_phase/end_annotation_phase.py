import json

from django_extension.tests import ExtendedTestCase
from freezegun import freeze_time

from backend.api.models import AnnotationPhase
from backend.api.tests.fixtures import ALL_FIXTURES
from backend.aplose.models import User

QUERY = """
mutation ($id: ID!) {
    endAnnotationPhase(id: $id) {
        ok
    }
}
"""
BASE_VARIABLES = {"id": 1}


@freeze_time("2012-01-14 00:00:00")
class EndAnnotationPhaseTestCase(ExtendedTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ALL_FIXTURES

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

    def _test_end(self, username: str):
        phase = AnnotationPhase.objects.get(pk=1)

        self.assertTrue(phase.is_open)
        self.assertIsNone(phase.ended_at)
        self.assertIsNone(phase.ended_by_id)

        response = self.gql_query(
            QUERY, user=User.objects.get(username=username), variables=BASE_VARIABLES
        )
        self.assertResponseNoErrors(response)

        phase = AnnotationPhase.objects.get(pk=1)
        self.assertFalse(phase.is_open)
        self.assertEqual(phase.ended_at.isoformat(), "2012-01-14T00:00:00+00:00")
        self.assertEqual(phase.ended_by.username, username)

    def test_connected_admin(self):
        self._test_end("admin")

    def test_connected_owner(self):
        self._test_end("user1")
