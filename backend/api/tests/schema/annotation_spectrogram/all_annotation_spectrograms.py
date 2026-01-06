import json

from graphene_django.utils import GraphQLTestCase

from backend.api.tests.fixtures import ALL_FIXTURES
from backend.api.tests.schema.spectrogram_analysis.all_spectrogram_analysis_for_import import (
    VARIABLES,
)

QUERY = """
query (
    $annotatorID: ID!
    $campaignID: ID!
    $phaseType: AnnotationPhaseType!

    # Pagination
    $limit: Int!
    $offset: Int!

    # Filtering
    $search: String
    $status: AnnotationTaskStatus
    $from: DateTime
    $to: DateTime

    $withAnnotations: Boolean
    $annotationLabel: String
    $annotationConfidence: String
    $annotationDetector: ID
    $annotationAnnotator: ID
    $withAcousticFeatures: Boolean
) {
    allAnnotationSpectrograms(
        # Sort
        limit: $limit
        offset: $offset
        orderBy: "start"

        # Only assigned
        annotator: $annotatorID
        annotationCampaign: $campaignID
        phase: $phaseType

        # Search
        filename_Icontains: $search

        # Dates filters
        end_Gte: $from
        start_Lte: $to

        # Task filters
        annotationTasks_Status: $status

        # Annotation filters
        annotations_Exists: $withAnnotations
        annotations_LabelName: $annotationLabel
        annotations_Confidence_Label: $annotationConfidence
        annotations_Detector: $annotationDetector
        annotations_Annotator: $annotationAnnotator
        annotations_AcousticFeatures_Exists: $withAcousticFeatures
    ) {
        totalCount
        resumeSpectrogramId(phase: $phaseType, campaignId: $campaignID)
        results {
            id
            filename
            start
            duration

            task(
                phase: $phaseType
                campaignId: $campaignID
            ) {
                status
                annotations: userAnnotations(
                    annotator: $annotationAnnotator
                    label_Name: $annotationLabel
                    confidence_Label: $annotationConfidence
                    detectorConfiguration_Detector: $annotationDetector
                    acousticFeatures_Exists: $withAcousticFeatures
                ) {
                    totalCount
                }
                validatedAnnotations: annotationsToCheck(
                    isValidatedBy: $annotatorID
                    annotator: $annotationAnnotator
                    label_Name: $annotationLabel
                    confidence_Label: $annotationConfidence
                    detectorConfiguration_Detector: $annotationDetector
                    acousticFeatures_Exists: $withAcousticFeatures
                ) {
                    totalCount
                }
            }
        }
        totalCount
    }
}
"""
QUERY_FOR_SPECTROGRAM = """
query (
    $spectrogramID: ID!
    $annotatorID: ID!
    $campaignID: ID!
    $phaseType: AnnotationPhaseType!
) {
    allAnnotationSpectrograms(
        # Sort
        orderBy: "start"

        # Only assigned
        annotator: $annotatorID
        annotationCampaign: $campaignID
        phase: $phaseType
    ) {
        currentIndex(spectrogramId: $spectrogramID)
        totalCount
        previousSpectrogramId(spectrogramId: $spectrogramID)
        nextSpectrogramId(spectrogramId: $spectrogramID)
    }
}
"""
VARIABLES = {
    "annotatorID": 1,
    "campaignID": 1,
    "phaseType": "Annotation",
    "limit": 20,
    "offset": 0,
    "search": None,
    "status": None,
    "from": None,
    "to": None,
    "withAnnotations": None,
    "annotationLabel": None,
    "annotationConfidence": None,
    "annotationDetector": None,
    "annotationAnnotator": None,
    "withAcousticFeatures": None,
}
VARIABLES_FOR_SPECTROGRAM = {
    "spectrogramID": 1,
    "annotatorID": 1,
    "campaignID": 1,
    "phaseType": "Annotation",
}


class AllAnnotationSpectrogramsTestCase(GraphQLTestCase):

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

        content = json.loads(response.content)["data"]["allAnnotationSpectrograms"][
            "results"
        ]
        self.assertEqual(len(content), 0)

    def test_connected_empty_user(self):
        self.client.login(username="user4", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "annotatorID": 6,
            },
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationSpectrograms"][
            "results"
        ]
        self.assertEqual(len(content), 0)

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

        content = json.loads(response.content)["data"]["allAnnotationSpectrograms"]
        results = content["results"]
        self.assertEqual(len(results), 4)

        self.assertEqual(content["totalCount"], 4)
        self.assertEqual(content["resumeSpectrogramId"], "7")
        self.assertEqual(results[0]["id"], "7")
        self.assertEqual(results[0]["filename"], "sound007")
        self.assertEqual(results[0]["task"]["annotations"]["totalCount"], 3)

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

        content = json.loads(response.content)["data"]["allAnnotationSpectrograms"]
        results = content["results"]
        self.assertEqual(len(results), 6)

        self.assertEqual(content["totalCount"], 6)
        self.assertEqual(content["resumeSpectrogramId"], "2")
        self.assertEqual(results[0]["id"], "1")
        self.assertEqual(results[0]["filename"], "sound001")
        self.assertEqual(results[0]["task"]["annotations"]["totalCount"], 3)

    def test_connected_admin_for_spectrogram(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY_FOR_SPECTROGRAM,
            variables={
                **VARIABLES_FOR_SPECTROGRAM,
                "annotatorID": 1,
            },
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["allAnnotationSpectrograms"]
        self.assertEqual(content["totalCount"], 6)
        self.assertEqual(content["currentIndex"], 0)
        self.assertIsNone(content["previousSpectrogramId"])
        self.assertEqual(content["nextSpectrogramId"], "2")

    # Filters

    def test_connected_admin__search_empty(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "annotatorID": 1,
                "search": "sound010",  # This file is not assigned to this user
            },
        )
        self.assertResponseNoErrors(response)

        results = json.loads(response.content)["data"]["allAnnotationSpectrograms"][
            "results"
        ]
        self.assertEqual(len(results), 0)

    def test_connected_admin__search_correct(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "annotatorID": 1,
                "search": "sound001",  # This file is assigned to this user
            },
        )
        self.assertResponseNoErrors(response)

        results = json.loads(response.content)["data"]["allAnnotationSpectrograms"][
            "results"
        ]
        self.assertEqual(len(results), 1)

    def test_connected_admin__status_finished(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "annotatorID": 1,
                "status": "Finished",
            },
        )
        self.assertResponseNoErrors(response)

        results = json.loads(response.content)["data"]["allAnnotationSpectrograms"][
            "results"
        ]
        self.assertEqual(len(results), 1)

    def test_connected_admin__status_created(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "annotatorID": 1,
                "status": "Created",
            },
        )
        self.assertResponseNoErrors(response)

        results = json.loads(response.content)["data"]["allAnnotationSpectrograms"][
            "results"
        ]
        self.assertEqual(len(results), 5)

    def test_connected_admin__label_empty(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "annotatorID": 1,
                "withAnnotations": True,
                "annotationLabel": "Boat",
            },
        )
        self.assertResponseNoErrors(response)

        results = json.loads(response.content)["data"]["allAnnotationSpectrograms"][
            "results"
        ]
        self.assertEqual(len(results), 0)

    def test_connected_admin__label(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "annotatorID": 1,
                "withAnnotations": True,
                "annotationLabel": "Odoncetes",
            },
        )
        self.assertResponseNoErrors(response)

        results = json.loads(response.content)["data"]["allAnnotationSpectrograms"][
            "results"
        ]
        self.assertEqual(len(results), 1)

    def test_connected_admin__confidence_empty(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "annotatorID": 1,
                "withAnnotations": True,
                "annotationConfidence": "wrong",
            },
        )
        self.assertResponseNoErrors(response)

        results = json.loads(response.content)["data"]["allAnnotationSpectrograms"][
            "results"
        ]
        self.assertEqual(len(results), 0)

    def test_connected_admin__confidence(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "annotatorID": 1,
                "withAnnotations": True,
                "annotationConfidence": "confident",
            },
        )
        self.assertResponseNoErrors(response)

        results = json.loads(response.content)["data"]["allAnnotationSpectrograms"][
            "results"
        ]
        self.assertEqual(len(results), 1)

    def test_connected_admin__acoustic_features_exists(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "annotatorID": 1,
                "withAnnotations": True,
                "withAcousticFeatures": True,
            },
        )
        self.assertResponseNoErrors(response)

        results = json.loads(response.content)["data"]["allAnnotationSpectrograms"][
            "results"
        ]
        self.assertEqual(len(results), 1)

    def test_connected_admin__acoustic_features_not_exists(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "annotatorID": 1,
                "withAnnotations": True,
                "withAcousticFeatures": False,
            },
        )
        self.assertResponseNoErrors(response)

        results = json.loads(response.content)["data"]["allAnnotationSpectrograms"][
            "results"
        ]
        self.assertEqual(len(results), 1)

    def test_connected_admin__with_annotations(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "annotatorID": 1,
                "withAnnotations": True,
            },
        )
        self.assertResponseNoErrors(response)

        results = json.loads(response.content)["data"]["allAnnotationSpectrograms"][
            "results"
        ]
        self.assertEqual(len(results), 1)

    def test_connected_admin__without_annotations(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "annotatorID": 1,
                "withAnnotations": False,
            },
        )
        self.assertResponseNoErrors(response)

        results = json.loads(response.content)["data"]["allAnnotationSpectrograms"][
            "results"
        ]
        self.assertEqual(len(results), 5)

    def test_connected_admin__detector_empty(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "annotatorID": 1,
                "withAnnotations": True,
                "annotationDetector": 2,
            },
        )
        self.assertResponseNoErrors(response)

        results = json.loads(response.content)["data"]["allAnnotationSpectrograms"][
            "results"
        ]
        self.assertEqual(len(results), 0)

    def test_connected_admin__detector(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "campaignID": 4,
                "phaseType": "Verification",
                "annotatorID": 1,
                "withAnnotations": True,
                "annotationDetector": 1,
            },
        )
        self.assertResponseNoErrors(response)

        results = json.loads(response.content)["data"]["allAnnotationSpectrograms"][
            "results"
        ]
        self.assertEqual(len(results), 1)

    def test_connected_admin__from(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "annotatorID": 1,
                "from": "2012-10-03 11:00:02+00:00",
            },
        )
        self.assertResponseNoErrors(response)

        results = json.loads(response.content)["data"]["allAnnotationSpectrograms"][
            "results"
        ]
        self.assertEqual(len(results), 5)

    def test_connected_admin__to(self):
        self.client.login(username="admin", password="osmose29")
        response = self.query(
            QUERY,
            variables={
                **VARIABLES,
                "annotatorID": 1,
                "to": "2012-10-03 11:00:02+00:00",
            },
        )
        self.assertResponseNoErrors(response)

        results = json.loads(response.content)["data"]["allAnnotationSpectrograms"][
            "results"
        ]
        self.assertEqual(len(results), 2)
