import json

from graphene_django.utils import GraphQLTestCase

from backend.api.models import AnnotationTask
from backend.api.tests.fixtures import ALL_FIXTURES

QUERY = """
mutation (
    $campaignID: ID!
    $spectrogramID: ID!
    $phase: AnnotationPhaseType!
    $annotations: [AnnotationInput]!
    $taskComments: [AnnotationCommentInput]!

    $startedAt: DateTime!
    $endedAt: DateTime!
) {
    submitAnnotationTask(
        spectrogramId: $spectrogramID
        phaseType: $phase
        campaignId: $campaignID
        startedAt: $startedAt
        endedAt: $endedAt
        annotations: $annotations
        taskComments: $taskComments
    ) {
        ok
        annotationErrors {
            field
            messages
        }
        taskCommentsErrors {
            field
            messages
        }
    }
}
"""
BASE_VARIABLES = {
    "campaignID": 1,
    "spectrogramID": 9,
    "phase": "Annotation",
    "startedAt": "2018-02-01T00:00:00Z",
    "endedAt": "2018-02-01T00:00:00Z",
    "content": "",
    "annotations": [],
    "taskComments": [],
}


class SubmitAnnotationTaskTestCase(GraphQLTestCase):

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

    def test_connected_unknown(self):
        self.client.login(username="user4", password="osmose29")
        response = self.query(QUERY, variables={**BASE_VARIABLES})
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Not found")

    def test_connected_annotator(self):
        self.client.login(username="user2", password="osmose29")
        task = AnnotationTask.objects.get(pk=9)
        old_count = task.sessions.count()
        response = self.query(QUERY, variables=BASE_VARIABLES)
        self.assertResponseNoErrors(response)

        task = AnnotationTask.objects.get(pk=9)
        self.assertEqual(task.status, AnnotationTask.Status.FINISHED)
        self.assertEqual(old_count + 1, task.sessions.count())
