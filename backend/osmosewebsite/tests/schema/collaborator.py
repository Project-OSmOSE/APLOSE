"""Collaborator DRF-Viewset test file"""
import json

from django_extension.tests import ExtendedTestCase

from backend.osmosewebsite.serializers.collaborator import CollaboratorFields

QUERY = """
query (
    $showOnHomePage: Boolean
    $showOnAploseHome: Boolean
) {
    allCollaborators(
        showOnHomePage: $showOnHomePage
        showOnAploseHome: $showOnAploseHome
    ) {
        results {
            name
            thumbnail
            url
            showOnHomePage
            showOnAploseHome
        }
    }
}
"""


class CollaboratorGqlTestCase(ExtendedTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ["collaborator"]

    def test_list(self):
        """CollaboratorViewSet 'list' returns list of Collaborator"""
        response = self.gql_query(QUERY)
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)["data"]["allCollaborators"]["results"]
        self.assertEqual(len(content), 3)
        self.assertEqual(content[0]["name"], "collaborator2")
        self.assertEqual(content[0]["showOnHomePage"], False)

    def test_on_home(self):
        """CollaboratorViewSet 'list' returns the list of Collaborator to show on home page"""
        response = self.gql_query(QUERY, variables={"showOnHomePage": True})
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)["data"]["allCollaborators"]["results"]
        self.assertEqual(len(content), 2)
        self.assertEqual(content[0]["showOnHomePage"], True)
        self.assertEqual(content[1]["showOnHomePage"], True)

    def test_on_aplose_home(self):
        """CollaboratorViewSet 'list' returns the list of Collaborator to show on home page"""
        response = self.gql_query(QUERY, variables={"showOnAploseHome": True})
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)["data"]["allCollaborators"]["results"]
        self.assertEqual(len(content), 2)
        self.assertEqual(content[0]["showOnAploseHome"], True)
        self.assertEqual(content[1]["showOnAploseHome"], True)
