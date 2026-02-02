"""API data GraphQL tests - List datasets for import"""
import json
from os.path import join

from django.conf import settings
from django.test import override_settings
from django_extension.tests import ExtendedTestCase

from backend.aplose.models import User

IMPORT_FIXTURES = settings.FIXTURE_DIRS[1] / "data" / "dataset" / "list_to_import"

QUERY = """
query {
    allDatasetsForImport {
        name
        path
        legacy
        analysis {
            name
            path
        }
    }
}
"""


class AllDatasetsAvailableForImportTestCase(ExtendedTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ["users"]

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.gql_query(QUERY)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected_not_staff(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="user1"),
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Forbidden")

    @override_settings(DATASET_IMPORT_FOLDER=IMPORT_FIXTURES / "legacy" / "good")
    def test_list_legacy(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="staff"),
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allDatasetsForImport"]
        self.assertEqual(len(content), 1)
        self.assertEqual(content[0]["name"], "gliderSPAmsDemo")
        self.assertEqual(content[0]["path"], "gliderSPAmsDemo")
        self.assertEqual(len(content[0]["analysis"]), 1)
        self.assertEqual(content[0]["analysis"][0]["name"], "4096_512_85")
        self.assertEqual(
            content[0]["analysis"][0]["path"],
            join("processed", "spectrogram", "600_480", "4096_512_85"),
        )

    @override_settings(DATASET_IMPORT_FOLDER=IMPORT_FIXTURES / "good")
    def test_list(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="staff"),
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allDatasetsForImport"]
        self.assertEqual(len(content), 1)
        self.assertEqual(content[0]["name"], "tp_osekit")
        self.assertEqual(content[0]["path"], "tp_osekit")
        self.assertEqual(len(content[0]["analysis"]), 1)
        self.assertEqual(content[0]["analysis"][0]["name"], "my_first_analysis")
        self.assertEqual(
            content[0]["analysis"][0]["path"], join("processed", "my_first_analysis")
        )
