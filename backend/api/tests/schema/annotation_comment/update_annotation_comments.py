import json

from graphene_django.utils import GraphQLTestCase

from backend.api.models import AnnotationComment
from backend.api.tests.fixtures import ALL_FIXTURES

QUERY = """
mutation (
    $campaignID: ID!
    $spectrogramID: ID!
    $phase: AnnotationPhaseType!
    $comments: [AnnotationCommentInput]!
) {
    updateAnnotationComments(input: {
        campaignId: $campaignID
        phaseType: $phase
        spectrogramId: $spectrogramID
        list: $comments
        annotationId: null
    }) {
        errors {
            messages
            field
        }
    }
}
"""
BASE_VARIABLES = {
    "campaignID": 1,
    "spectrogramID": 7,
    "phase": "Annotation",
    "comments": [],
}

comment = {
    "comment": "Test A",
}


class UpdateAnnotationCommentsTestCase(GraphQLTestCase):

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

        previous_count = AnnotationComment.objects.count()
        response = self.query(QUERY, variables=BASE_VARIABLES)
        self.assertResponseNoErrors(response)
        self.assertEqual(AnnotationComment.objects.count(), previous_count)

    def test_connected_annotator_add(self):
        self.client.login(username="user2", password="osmose29")

        previous_count = AnnotationComment.objects.count()
        response = self.query(
            QUERY, variables={**BASE_VARIABLES, "comments": [comment]}
        )
        self.assertResponseNoErrors(response)
        self.assertEqual(AnnotationComment.objects.count(), previous_count + 1)
        new_comment: AnnotationComment = AnnotationComment.objects.order_by("id").last()
        self.assertEqual(new_comment.comment, comment["comment"])
        self.assertEqual(new_comment.author_id, 4)
        self.assertEqual(new_comment.spectrogram_id, 7)
        self.assertEqual(new_comment.annotation_phase_id, 1)
        self.assertIsNone(new_comment.annotation)

    def test_connected_annotator_update(self):
        self.client.login(username="user2", password="osmose29")
        self.test_connected_annotator_add()
        new_comment: AnnotationComment = AnnotationComment.objects.order_by("id").last()

        previous_count = AnnotationComment.objects.count()
        response = self.query(
            QUERY,
            variables={
                **BASE_VARIABLES,
                "comments": [{"id": new_comment.id, "comment": "ZZZ"}],
            },
        )
        self.assertResponseNoErrors(response)
        new_comment: AnnotationComment = AnnotationComment.objects.order_by("id").last()
        self.assertEqual(AnnotationComment.objects.count(), previous_count)
        self.assertEqual(new_comment.comment, "ZZZ")

    def test_connected_annotator_remove(self):
        self.client.login(username="user2", password="osmose29")
        self.test_connected_annotator_add()

        previous_count = AnnotationComment.objects.count()
        response = self.query(
            QUERY,
            variables={**BASE_VARIABLES, "comments": []},
        )
        self.assertResponseNoErrors(response)
        self.assertEqual(AnnotationComment.objects.count(), previous_count - 1)
