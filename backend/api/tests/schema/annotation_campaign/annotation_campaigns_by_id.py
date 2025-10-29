import json

from graphene_django.utils import GraphQLTestCase

from backend.api.tests.fixtures import ALL_FIXTURES
from backend.api.tests.schema.spectrogram_analysis.all_spectrogram_analysis_for_import import (
    VARIABLES,
)

QUERY = """
query ($id: ID!) {
    annotationCampaignById(id: $id) {
        id
        name
        createdAt
        instructionsUrl
        deadline
        isArchived
        canManage
        allowPointAnnotation
        allowColormapTuning
        allowImageTuning
        colormapDefault
        colormapInvertedDefault
        dataset {
            id
            name
        }
        labelsWithAcousticFeatures {
            id
            name
        }
        owner {
            id
            displayName
            email
        }
        description
        archive {
            date
            byUser {
                displayName
            }
        }
        spectrograms {
            totalCount
        }
        confidenceSet {
            name
            desc
            confidenceIndicators {
                label
            }
        }
        labelSet {
            name
            description
            labels {
                name
            }
        }
        detectors {
            id
            name
        }
        annotators {
            id
            displayName
        }
        analysis {
            edges {
                node {
                    id
                    colormap {
                        name
                    }
                    fft {
                        nfft
                        windowSize
                        overlap
                        samplingFrequency
                    }
                    legacyConfiguration {
                        scaleName
                        zoomLevel
                        linearFrequencyScale {
                            ratio
                            minValue
                            maxValue
                        }
                        multiLinearFrequencyScale {
                            innerScales {
                                ratio
                                minValue
                                maxValue
                            }
                        }
                    }
                    legacy
                }
            }
        }
    }
}
"""
VARIABLES = {
    "id": 1,
}
ARCHIVED_VARIABLES = {
    "id": 3,
}


class AnnotationCampaignsByIDTestCase(GraphQLTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ALL_FIXTURES

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def _test_get_by_id(self, username: str):
        self.client.login(username=username, password="osmose29")
        response = self.query(QUERY, variables=VARIABLES)
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["annotationCampaignById"]
        self.assertEqual(content["name"], "Test SPM campaign")
        self.assertEqual(content["dataset"]["id"], "1")
        self.assertEqual(content["labelsWithAcousticFeatures"], [])
        self.assertEqual(content["owner"]["email"], "user1@osmose.xyz")
        self.assertIsNone(content["archive"])
        self.assertEqual(content["confidenceSet"]["name"], "Confidence/NoConfidence")
        self.assertEqual(content["labelSet"]["name"], "Test SPM campaign")
        self.assertEqual(len(content["annotators"]), 2)
        self.assertEqual(content["annotators"][0]["id"], "1")
        self.assertEqual(len(content["analysis"]["edges"]), 1)

    def _test_get_by_id_archived(self, username: str):
        self.client.login(username=username, password="osmose29")
        response = self.query(QUERY, variables=ARCHIVED_VARIABLES)
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["annotationCampaignById"]
        self.assertEqual(content["name"], "Test RTF campaign")
        self.assertEqual(content["owner"]["email"], "user1@osmose.xyz")
        self.assertIsNotNone(content["archive"])

    def test_not_connected(self):
        response = self.query(QUERY, variables=VARIABLES)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected_empty_user(self):
        self.client.login(username="user4", password="osmose29")
        response = self.query(QUERY, variables=VARIABLES)
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)["data"]["annotationCampaignById"]
        self.assertIsNone(content)

    def test_connected_annotator(self):
        self._test_get_by_id("user2")

    def test_connected_annotator_archived(self):
        self.client.login(username="user2", password="osmose29")
        response = self.query(QUERY, variables=ARCHIVED_VARIABLES)
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)["data"]["annotationCampaignById"]
        self.assertIsNone(content)

    def test_connected_owner(self):
        self._test_get_by_id("user1")

    def test_connected_owner_archived(self):
        self._test_get_by_id_archived("user1")

    def test_connected_admin(self):
        self._test_get_by_id("admin")

    def test_connected_admin_archived(self):
        self._test_get_by_id_archived("admin")
