import json

from graphene_django.utils import GraphQLTestCase

from backend.api.models import Annotation
from backend.api.tests.fixtures import ALL_FIXTURES

QUERY = """
mutation (
    $campaignID: ID!
    $spectrogramID: ID!
    $phase: AnnotationPhaseType!
    $annotations: [AnnotationInput]!
) {
    updateAnnotations(input: {
        campaignId: $campaignID
        phaseType: $phase
        spectrogramId: $spectrogramID
        list: $annotations
    }) {
        errors {
            messages
            field
        }
        _debug {
            exceptions {
                stack
            }
        }
    }
    _debug {
        exceptions {
            stack
        }
    }
}
"""
BASE_VARIABLES = {
    "campaignID": 1,
    "spectrogramID": 9,
    "phase": "Annotation",
    "annotations": [],
}

presence_annotation = {
    "label": "Boat",
    "confidence": "confident",
    "startTime": None,
    "endTime": None,
    "startFrequency": None,
    "endFrequency": None,
    "acousticFeatures": None,
    "analysis": "1",
}
box_annotation = {
    "label": "Boat",
    "confidence": "confident",
    "startTime": 0,
    "endTime": 10,
    "startFrequency": 5,
    "endFrequency": 25,
    "acousticFeatures": {
        "startFrequency": 10.0,
        "endFrequency": 50.0,
        "relativeMaxFrequencyCount": 5,
        "relativeMinFrequencyCount": 4,
        "stepsCount": 2,
        "hasHarmonics": True,
        "trend": "Modulated",
    },
    "analysis": "1",
}


class UpdateAnnotationsTestCase(GraphQLTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ["users", *ALL_FIXTURES]

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.query(QUERY, variables=BASE_VARIABLES)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected_base_user(self):
        self.client.login(username="user4", password="osmose29")
        response = self.query(QUERY, variables={**BASE_VARIABLES, "campaignID": 99})
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Not found")

    def test_connected_annotator_update_empty(self):
        self.client.login(username="user2", password="osmose29")

        previous_count = Annotation.objects.count()
        response = self.query(QUERY, variables=BASE_VARIABLES)
        self.assertResponseNoErrors(response)
        self.assertEqual(Annotation.objects.count(), previous_count)

    def test_connected_annotator_add_presence(self):
        self.client.login(username="user2", password="osmose29")

        previous_count = Annotation.objects.count()
        response = self.query(
            QUERY, variables={**BASE_VARIABLES, "annotations": [presence_annotation]}
        )
        self.assertResponseNoErrors(response)
        self.assertEqual(Annotation.objects.count(), previous_count + 1)

        new_annotation: Annotation = Annotation.objects.order_by("id").last()
        self.assertEqual(new_annotation.type, Annotation.Type.WEAK)
        self.assertEqual(new_annotation.label.name, "Boat")
        self.assertEqual(new_annotation.confidence.label, "confident")
        self.assertEqual(new_annotation.analysis_id, 1)
        self.assertEqual(new_annotation.spectrogram_id, 9)
        self.assertEqual(new_annotation.annotator_id, 4)
        self.assertIsNone(new_annotation.acoustic_features)

    def test_connected_annotator_add_box(self):
        self.client.login(username="user2", password="osmose29")

        previous_count = Annotation.objects.count()
        response = self.query(
            QUERY, variables={**BASE_VARIABLES, "annotations": [box_annotation]}
        )
        self.assertResponseNoErrors(response)
        self.assertEqual(Annotation.objects.count(), previous_count + 1)

        new_annotation: Annotation = Annotation.objects.order_by("id").last()
        self.assertEqual(new_annotation.type, Annotation.Type.BOX)
        self.assertEqual(new_annotation.start_time, 0.0)
        self.assertEqual(new_annotation.label.name, "Boat")
        self.assertEqual(new_annotation.confidence.label, "confident")
        self.assertEqual(new_annotation.analysis_id, 1)
        self.assertEqual(new_annotation.spectrogram_id, 9)
        self.assertEqual(new_annotation.annotator_id, 4)
        self.assertEqual(new_annotation.acoustic_features.start_frequency, 10.0)

    def test_connected_annotator_update_presence_to_box(self):
        self.client.login(username="user2", password="osmose29")
        self.test_connected_annotator_add_presence()

        previous_count = Annotation.objects.count()
        new_annotation: Annotation = Annotation.objects.order_by("id").last()
        response = self.query(
            QUERY,
            variables={
                **BASE_VARIABLES,
                "annotations": [
                    {
                        **box_annotation,
                        "id": new_annotation.id,
                    }
                ],
            },
        )
        self.assertResponseNoErrors(response)
        self.assertEqual(Annotation.objects.count(), previous_count)

        new_annotation: Annotation = Annotation.objects.order_by("id").last()
        self.assertEqual(new_annotation.type, Annotation.Type.BOX)
        self.assertEqual(new_annotation.start_time, 0.0)
        self.assertEqual(new_annotation.label.name, "Boat")
        self.assertEqual(new_annotation.confidence.label, "confident")
        self.assertEqual(new_annotation.analysis_id, 1)
        self.assertEqual(new_annotation.spectrogram_id, 9)
        self.assertEqual(new_annotation.annotator_id, 4)
        self.assertEqual(new_annotation.acoustic_features.start_frequency, 10.0)

    def test_connected_annotator_remove(self):
        self.client.login(username="user2", password="osmose29")
        self.test_connected_annotator_add_presence()

        previous_count = Annotation.objects.count()
        response = self.query(
            QUERY,
            variables={
                **BASE_VARIABLES,
                "annotations": [],
            },
        )
        self.assertResponseNoErrors(response)
        self.assertEqual(Annotation.objects.count(), previous_count - 1)

    def test_connected_annotator_add_update_of(self):
        self.client.login(username="user2", password="osmose29")
        self.test_connected_annotator_add_box()

        previous_count = Annotation.objects.count()
        box: Annotation = Annotation.objects.order_by("id").last()
        response = self.query(
            QUERY,
            variables={
                **BASE_VARIABLES,
                "annotations": [
                    {
                        **box_annotation,
                        "id": box.id,
                    },
                    {
                        **box_annotation,
                        "isUpdateOf": str(box.id),
                        "label": "Mysticetes",
                    },
                ],
            },
        )
        self.assertResponseNoErrors(response)
        self.assertEqual(Annotation.objects.count(), previous_count + 1)

        box = Annotation.objects.get(id=box.id)
        update: Annotation = box.updated_to.order_by("id").last()
        self.assertEqual(update.label.name, "Mysticetes")

    def test_connected_annotator_add_presence_with_comment(self):
        self.client.login(username="user2", password="osmose29")

        previous_count = Annotation.objects.count()
        response = self.query(
            QUERY,
            variables={
                **BASE_VARIABLES,
                "annotations": [
                    {**presence_annotation, "comments": [{"comment": "AAA"}]}
                ],
            },
        )
        self.assertResponseNoErrors(response)
        self.assertEqual(Annotation.objects.count(), previous_count + 1)

        new_annotation: Annotation = Annotation.objects.order_by("id").last()
        self.assertEqual(new_annotation.annotation_comments.first().comment, "AAA")

    # Corrected

    def test_connected_annotator_add_wrong_order(self):
        self.client.login(username="user2", password="osmose29")

        previous_count = Annotation.objects.count()
        response = self.query(
            QUERY,
            variables={
                **BASE_VARIABLES,
                "annotations": [
                    {
                        **presence_annotation,
                        "startTime": 9,
                        "endTime": 7,
                        "startFrequency": 9,
                        "endFrequency": 7,
                    }
                ],
            },
        )
        self.assertResponseNoErrors(response)
        self.assertEqual(Annotation.objects.count(), previous_count + 1)

        new_annotation: Annotation = Annotation.objects.order_by("id").last()
        self.assertEqual(new_annotation.start_time, 7)
        self.assertEqual(new_annotation.end_time, 9)
        self.assertEqual(new_annotation.start_frequency, 7)
        self.assertEqual(new_annotation.end_frequency, 9)

    # Errors

    def test_connected_annotator_does_not_exists(self):
        self.client.login(username="user2", password="osmose29")

        previous_count = Annotation.objects.count()
        response = self.query(
            QUERY,
            variables={
                **BASE_VARIABLES,
                "campaignID": 2,  # Campaign without confidence set
                "annotations": [
                    {
                        **presence_annotation,
                        "label": "DCall",  # label exist in different label set
                        "confidence": "test",
                        "analysis": "-1",
                    }
                ],
            },
        )
        self.assertEqual(Annotation.objects.count(), previous_count)

        errors = json.loads(response.content)["data"]["updateAnnotations"]["errors"]
        self.assertEqual(errors[0][0]["field"], "label")
        self.assertEqual(errors[0][1]["field"], "confidence")
        self.assertEqual(errors[0][2]["field"], "analysis")

    def test_connected_annotator_min_value(self):
        self.client.login(username="user2", password="osmose29")

        previous_count = Annotation.objects.count()
        response = self.query(
            QUERY,
            variables={
                **BASE_VARIABLES,
                "annotations": [
                    {
                        **presence_annotation,
                        "startTime": -1,
                        "endTime": -1,
                        "startFrequency": -1,
                        "endFrequency": -1,
                    }
                ],
            },
        )
        self.assertEqual(Annotation.objects.count(), previous_count)

        errors = json.loads(response.content)["data"]["updateAnnotations"]["errors"]
        self.assertEqual(errors[0][0]["field"], "startTime")
        self.assertEqual(errors[0][1]["field"], "endTime")
        self.assertEqual(errors[0][2]["field"], "startFrequency")
        self.assertEqual(errors[0][3]["field"], "endFrequency")

    def test_connected_annotator_max_value(self):
        self.client.login(username="user2", password="osmose29")

        previous_count = Annotation.objects.count()
        response = self.query(
            QUERY,
            variables={
                **BASE_VARIABLES,
                "annotations": [
                    {
                        **presence_annotation,
                        "startTime": 16 * 60,
                        "endTime": 17 * 60,
                        "startFrequency": 130_000,
                        "endFrequency": 140_000,
                    }
                ],
            },
        )
        self.assertEqual(Annotation.objects.count(), previous_count)

        errors = json.loads(response.content)["data"]["updateAnnotations"]["errors"]
        self.assertEqual(errors[0][0]["field"], "startTime")
        self.assertEqual(errors[0][1]["field"], "endTime")
        self.assertEqual(errors[0][2]["field"], "startFrequency")
        self.assertEqual(errors[0][3]["field"], "endFrequency")
