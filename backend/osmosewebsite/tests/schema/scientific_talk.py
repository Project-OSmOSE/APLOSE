"""ScientificTalk tests"""
import json

from django_extension.tests import ExtendedTestCase

ALL_QUERY = """
query {
    allScientificTalks {
        totalCount
        results {
            title
            thumbnail
            date
            intro
            osmoseMemberPresenters {
                edges {
                    node {
                        id
                        person {
                            initialNames
                        }
                    }
                }
            }
            otherPresenters
        }
    }
}
"""


class ScientificTalkGqlTestCase(ExtendedTestCase):
    """Test ScientificTalk when list or detail trap are request"""

    GRAPHQL_URL = "/api/graphql"
    fixtures = ["users", "scientific_talk"]

    def test_list(self):
        """ScientificTalkViewSet 'list' returns list of ScientificTalk"""
        response = self.gql_query(ALL_QUERY)
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)["data"]["allScientificTalks"]["results"]
        self.assertEqual(len(content), 2)
        self.assertEqual(
            content[1]["title"], "ECS 2023 Presentation et retour de conference"
        )
