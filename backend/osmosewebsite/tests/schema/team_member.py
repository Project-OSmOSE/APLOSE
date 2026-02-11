"""User DRF-Viewset test file"""
import json

from django_extension.tests import ExtendedTestCase

ALL_QUERY = """
query {
    allTeamMembers {
        results {
            id
            picture
            person {
                initialNames
                firstName
                lastName
                currentInstitutions {
                    name
                }
            }
            position
            type
        }
    }
}
"""
BY_ID_QUERY = """
query($id: ID!) {
    teamMemberById(id: $id) {
        position
        type
        picture
        biography
        person {
            firstName
            lastName
            initialNames
        }
        personalWebsiteUrl
        githubUrl
        mailAddress
        linkedinUrl
        researchGateUrl
    }
}
"""


class TeamMemberGqlTestCase(ExtendedTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ["team_member"]

    def test_list(self):
        """TeamMemberViewSet 'list' returns list of team members"""
        response = self.gql_query(ALL_QUERY)
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)["data"]["allTeamMembers"]["results"]
        self.assertEqual(len(content), 3)
        self.assertEqual(content[0]["person"]["firstName"], "user2")
        self.assertEqual(content[0]["position"], "job2")
        self.assertEqual(content[0]["type"], "Active")

    def test_retrieve(self):
        """TeamMemberViewSet 'retrieve' returns team members details"""
        response = self.gql_query(BY_ID_QUERY, variables={"id": 3})
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)["data"]["teamMemberById"]
        self.assertEqual(content["person"]["firstName"], "user3")
        self.assertEqual(content["position"], "job3")
        self.assertEqual(content["type"], "Former")
