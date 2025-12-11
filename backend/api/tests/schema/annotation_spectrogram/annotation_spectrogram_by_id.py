import json

from graphene_django.utils import GraphQLTestCase

from backend.api.tests.fixtures import ALL_FIXTURES
from backend.api.tests.schema.spectrogram_analysis.all_spectrogram_analysis_for_import import (
    VARIABLES,
)

QUERY = """
query (
    $spectrogramID: ID!
    $annotatorID: ID!
    $campaignID: ID!
    $analysisID: ID!
    $phaseType: AnnotationPhaseType!
) {
    annotationSpectrogramById(id: $spectrogramID) {
        id
        filename
        audioPath(analysisId: $analysisID)
        path(analysisId: $analysisID)
        start
        duration

        isAssigned(phase: $phaseType, campaignId: $campaignID)


        task(
            phase: $phaseType
            campaignId: $campaignID
        ) {
            status

            comments(
                author: $annotatorID,
                annotationPhase_Phase: $phaseType
            ) {
                results {
                    id
                    comment
                }
            }

            annotations {
                results {
                    id
                    type
                    startTime
                    endTime
                    startFrequency
                    endFrequency
                    label {
                        name
                    }
                    confidence {
                        label
                    }
                    detectorConfiguration {
                        detector {
                            id
                            name
                        }
                    }
                    annotator {
                        id,
                        displayName
                    }
                    comments(author: $annotatorID) {
                        results{
                            id
                            comment
                        }
                    }
                    validations(annotator: $annotatorID) {
                        results {
                            id
                            isValid
                        }
                    }
                    isUpdateOf {
                        id
                    }
                    acousticFeatures {
                        id
                        startFrequency
                        endFrequency
                        trend
                        stepsCount
                        relativeMinFrequencyCount
                        relativeMaxFrequencyCount
                        hasHarmonics
                    }
                    analysis {
                        id
                    }
                }
            }
        }
    }
}
"""
VARIABLES = {
    "spectrogramID": 7,
    "annotatorID": 1,
    "campaignID": 1,
    "analysisID": 1,
    "phaseType": "Annotation",
}


class AnnotationSpectrogramByIDTestCase(GraphQLTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ALL_FIXTURES

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.query(QUERY, variables=VARIABLES)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected_owner(self):
        self.client.login(username="user1", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "annotatorID": 3,
            },
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["annotationSpectrogramById"]
        self.assertEqual(content["id"], "7")
        self.assertIsNone(content["task"])

    def test_connected_empty_user(self):
        self.client.login(username="user4", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "annotatorID": 6,
            },
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Not found")

    def test_connected_admin(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "annotatorID": 1,
            },
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["annotationSpectrogramById"]
        self.assertEqual(content["id"], "7")
        self.assertIsNone(content["task"])

    def test_connected_annotator(self):
        self.client.login(username="user2", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "annotatorID": 4,
            },
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["annotationSpectrogramById"]
        self.assertEqual(content["id"], "7")
        self.assertEqual(content["task"]["status"], "Created")

        self.assertEqual(len(content["task"]["comments"]["results"]), 0)

        self.assertEqual(len(content["task"]["annotations"]["results"]), 3)
