import json

from django_extension.tests import ExtendedTestCase

from backend.api.models import AnnotationCampaign
from backend.api.tests.fixtures import ALL_FIXTURES
from backend.aplose.models import User

QUERY = """
query (
    $isArchived: Boolean
    $phase: AnnotationPhaseType
    $ownerID: ID
    $annotatorID: ID
    $search: String
) {
    allAnnotationCampaigns(
        isArchived: $isArchived
        phases_Phase: $phase
        ownerId: $ownerID
        phases_AnnotationFileRanges_AnnotatorId: $annotatorID
        search: $search
        
        orderBy: "name"
    ) {
        results {
            id
            name
            datasetName
            deadline
            isArchived
        }
    }
}
"""
VARIABLES = {
    "isArchived": None,
    "phase": None,
    "ownerID": None,
    "annotatorID": None,
    "search": None,
}


class AllAnnotationCampaignsTestCase(ExtendedTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ALL_FIXTURES

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.gql_query(
            QUERY,
            variables={
                **VARIABLES,
            },
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected_admin(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="admin"),
            variables={
                **VARIABLES,
            },
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationCampaigns"][
            "results"
        ]
        self.assertEqual(len(content), AnnotationCampaign.objects.count())
        self.assertEqual(content[0]["name"], "Test DCLDE LF campaign")
        self.assertEqual(content[1]["name"], "Test RTF campaign")

    def test_connected_owner(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="user1"),
            variables={
                **VARIABLES,
            },
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationCampaigns"][
            "results"
        ]
        self.assertEqual(len(content), 4)
        self.assertEqual(content[0]["name"], "Test DCLDE LF campaign")
        self.assertEqual(content[1]["name"], "Test RTF campaign")

    def test_connected_empty_user(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="user4"),
            variables={
                **VARIABLES,
            },
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationCampaigns"][
            "results"
        ]
        self.assertEqual(len(content), 0)

    def test_connected_admin_filter_owner(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="admin"),
            variables={
                **VARIABLES,
                "ownerID": 3,
            },
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationCampaigns"][
            "results"
        ]
        self.assertEqual(len(content), 4)
        self.assertEqual(content[0]["name"], "Test DCLDE LF campaign")
        self.assertEqual(content[1]["name"], "Test RTF campaign")

    def test_connected_admin_filter_annotator(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="admin"),
            variables={
                **VARIABLES,
                "annotatorID": 1,
            },
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationCampaigns"][
            "results"
        ]
        self.assertEqual(len(content), 3)
        self.assertEqual(content[0]["name"], "Test DCLDE LF campaign")
        self.assertEqual(content[1]["name"], "Test SPM campaign")

    def test_connected_admin_filter_archive(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="admin"),
            variables={**VARIABLES, "isArchived": True},
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationCampaigns"][
            "results"
        ]
        self.assertEqual(len(content), 1)
        self.assertEqual(content[0]["name"], "Test RTF campaign")

    def test_connected_admin_filter_phase(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="admin"),
            variables={**VARIABLES, "phase": "Verification"},
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationCampaigns"][
            "results"
        ]
        self.assertEqual(len(content), 1)
        self.assertEqual(content[0]["name"], "Test Z check campaign")

    def test_connected_admin_search_name(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="admin"),
            variables={**VARIABLES, "search": "RTF"},
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationCampaigns"][
            "results"
        ]
        self.assertEqual(len(content), 1)
        self.assertEqual(content[0]["name"], "Test RTF campaign")

    def test_connected_admin_search_dataset_name(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="admin"),
            variables={**VARIABLES, "search": "glider"},
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationCampaigns"][
            "results"
        ]
        self.assertEqual(len(content), 4)
        self.assertEqual(content[0]["name"], "Test DCLDE LF campaign")
