import json

from graphene_django.utils import GraphQLTestCase

from backend.api.models import AnnotationCampaign
from backend.api.tests.fixtures import ALL_FIXTURES
from backend.api.tests.schema.data.spectrogram_analysis.all_spectrogram_analysis_for_import import (
    VARIABLES,
)

QUERY = """
query ($userID: ID!, $annotatorID: Decimal, $ownerID: Decimal, $isArchived: Boolean, $phase: String, $search: String) {
  allAnnotationCampaigns(
    annotatorId: $annotatorID
    ownerId: $ownerID
    isArchived: $isArchived
    phaseType: $phase
    search: $search
    orderBy: "name"
  ) {
    results {
      name
      deadline
      tasksCount
      finishedTasksCount
      userTasksCount(id: $userID)
      userFinishedTasksCount(id: $userID)
      dataset {
        name
      }
      archive {
        id
      }
      phases {
        results {
          phase
        }
      }
    }
  }
}
"""
VARIABLES = {
    "annotatorID": None,
    "ownerID": None,
    "isArchived": None,
    "phase": None,
    "search": None,
}


class AllAnnotationCampaignsTestCase(GraphQLTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ALL_FIXTURES

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "userID": 1,
            },
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected_admin(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "userID": 1,
            },
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationCampaigns"][
            "results"
        ]
        self.assertEqual(len(content), AnnotationCampaign.objects.count())
        self.assertEqual(content[0]["name"], "Test DCLDE LF campaign")
        self.assertEqual(content[1]["name"], "Test RTF campaign")
        self.assertEqual(content[1]["phases"]["results"][0]["phase"], "Annotation")

    def test_connected_owner(self):
        self.client.login(username="user1", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "userID": 3,
            },
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationCampaigns"][
            "results"
        ]
        self.assertEqual(len(content), 3)
        self.assertEqual(content[0]["name"], "Test DCLDE LF campaign")
        self.assertEqual(content[1]["name"], "Test SPM campaign")
        self.assertEqual(content[1]["phases"]["results"][0]["phase"], "Annotation")

    def test_connected_empty_user(self):
        self.client.login(username="user4", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "userID": 6,
            },
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationCampaigns"][
            "results"
        ]
        self.assertEqual(len(content), 0)

    def test_connected_admin_filter_owner(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "userID": 1,
                "ownerID": 3,
            },
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationCampaigns"][
            "results"
        ]
        self.assertEqual(len(content), 3)
        self.assertEqual(content[0]["name"], "Test DCLDE LF campaign")
        self.assertEqual(content[1]["name"], "Test SPM campaign")
        self.assertEqual(content[1]["phases"]["results"][0]["phase"], "Annotation")

    def test_connected_admin_filter_annotator(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "userID": 1,
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
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={**VARIABLES, "userID": 1, "isArchived": True},
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationCampaigns"][
            "results"
        ]
        self.assertEqual(len(content), 1)
        self.assertEqual(content[0]["name"], "Test RTF campaign")

    def test_connected_admin_filter_phase(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={**VARIABLES, "userID": 1, "phase": "V"},
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationCampaigns"][
            "results"
        ]
        self.assertEqual(len(content), 1)
        self.assertEqual(content[0]["name"], "Test Z check campaign")

    def test_connected_admin_search_name(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={**VARIABLES, "userID": 1, "search": "RTF"},
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationCampaigns"][
            "results"
        ]
        self.assertEqual(len(content), 1)
        self.assertEqual(content[0]["name"], "Test RTF campaign")

    def test_connected_admin_search_dataset_name(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={**VARIABLES, "userID": 1, "search": "glider"},
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationCampaigns"][
            "results"
        ]
        self.assertEqual(len(content), 4)
        self.assertEqual(content[0]["name"], "Test DCLDE LF campaign")
