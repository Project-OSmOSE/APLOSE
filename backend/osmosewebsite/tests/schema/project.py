"""Project DRF-Viewset test file"""
import json

from django_extension.tests import ExtendedTestCase

ALL_QUERY = """
query {
    allWebsiteProjects {
        totalCount
        results {
            id
            title
            intro
            start
            end
            thumbnail
        }
    }
}
"""
BY_ID_QUERY = """
query($id: ID!) {
    websiteProjectById(id: $id) {
        title
        start
        end
        body
        osmoseMemberContacts {
            edges {
                node {
                    id
                    person {
                        initialNames
                    }
                }
            }
        }
        otherContacts
        collaborators {
            edges {
                node {
                    name
                    thumbnail
                    url
                }
            }
        }
    }
}
"""


class ProjectGqlTestCase(ExtendedTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ["project"]

    def test_list(self):
        """ProjectViewSet 'list' returns list of Project"""
        response = self.gql_query(ALL_QUERY)
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)["data"]["allWebsiteProjects"]["results"]
        self.assertEqual(len(content), 2)
        self.assertEqual(content[0]["title"], "title1")
        self.assertEqual(content[0]["intro"], "intro1")

    def test_retrieve(self):
        """ProjectViewSet 'retrieve' returns Project details"""
        response = self.gql_query(BY_ID_QUERY, variables={"id": 1})
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)["data"]["websiteProjectById"]
        self.assertEqual(content["title"], "title1")
        self.assertEqual(content["body"], "body1")
