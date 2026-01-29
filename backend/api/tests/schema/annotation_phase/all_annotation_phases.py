import json

from django_extension.tests import ExtendedTestCase

from backend.api.models import AnnotationPhase
from backend.api.tests.fixtures import ALL_FIXTURES
from backend.api.tests.schema.spectrogram_analysis.all_spectrogram_analysis_for_import import (
    VARIABLES,
)
from backend.aplose.models import User

QUERY = """
query (
    $isArchived: Boolean
    $phase: AnnotationPhaseType
    $campaignID: ID
    $ownerID: ID
    $annotatorID: ID
    $search: String
) {
    allAnnotationPhases(
        annotationCampaignId: $campaignID
        isCampaignArchived: $isArchived
        phase: $phase
        annotationCampaign_OwnerId: $ownerID
        annotationFileRanges_AnnotatorId: $annotatorID
        search: $search
    ) {
        results {
            id
            phase
            tasksCount
            completedTasksCount
            userTasksCount
            userCompletedTasksCount
            isOpen
        }
    }
}
"""
VARIABLES = {
    "isArchived": None,
    "phase": None,
    "ownerID": None,
    "annotatorID": None,
    "campaignID": None,
    "search": None,
}


class AllAnnotationPhasesTestCase(ExtendedTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ALL_FIXTURES

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.gql_query(QUERY, variables=VARIABLES)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected_admin(self):
        response = self.gql_query(
            QUERY, user=User.objects.get(username="admin"), variables=VARIABLES
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationPhases"]["results"]
        self.assertEqual(len(content), AnnotationPhase.objects.count())
        self.assertEqual(content[1]["phase"], "Annotation")

    def test_connected_owner(self):
        response = self.gql_query(
            QUERY, user=User.objects.get(username="user1"), variables=VARIABLES
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationPhases"]["results"]
        self.assertEqual(len(content), AnnotationPhase.objects.count())
        self.assertEqual(content[1]["phase"], "Annotation")

    def test_connected_empty_user(self):
        response = self.gql_query(
            QUERY, user=User.objects.get(username="user4"), variables=VARIABLES
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationPhases"]["results"]
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

        content = json.loads(response.content)["data"]["allAnnotationPhases"]["results"]
        self.assertEqual(len(content), AnnotationPhase.objects.count())
        self.assertEqual(content[1]["phase"], "Annotation")

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

        content = json.loads(response.content)["data"]["allAnnotationPhases"]["results"]
        self.assertEqual(len(content), 3)
        self.assertEqual(content[0]["phase"], "Annotation")
        self.assertEqual(content[2]["phase"], "Verification")

    def test_connected_admin_filter_archive(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="admin"),
            variables={
                **VARIABLES,
                "isArchived": True,
            },
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationPhases"]["results"]
        self.assertEqual(len(content), 1)
        self.assertEqual(content[0]["phase"], "Annotation")

    def test_connected_admin_filter_phase(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="admin"),
            variables={**VARIABLES, "phase": "Verification"},
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationPhases"]["results"]
        self.assertEqual(len(content), 1)
        self.assertEqual(content[0]["phase"], "Verification")

    def test_connected_admin_filter_campaign_id(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="admin"),
            variables={**VARIABLES, "campaignID": 3},
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationPhases"]["results"]
        self.assertEqual(len(content), 1)
        self.assertEqual(content[0]["phase"], "Annotation")

    def test_connected_admin_search_name(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="admin"),
            variables={**VARIABLES, "search": "RTF"},
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationPhases"]["results"]
        self.assertEqual(len(content), 1)
        self.assertEqual(content[0]["phase"], "Annotation")

    def test_connected_admin_search_dataset_name(self):
        response = self.gql_query(
            QUERY,
            user=User.objects.get(username="admin"),
            variables={**VARIABLES, "search": "glider"},
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationPhases"]["results"]
        self.assertEqual(len(content), AnnotationPhase.objects.count())
        self.assertEqual(content[0]["phase"], "Annotation")
