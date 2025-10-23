import json

from graphene_django.utils import GraphQLTestCase

from backend.api.tests.fixtures import DATA_FIXTURES

QUERY = """
query getDatasetByID($pk: PK!) {
    datasetByPk(pk: $pk) {
        name
        createdAt
        legacy
        path
        description
        start
        end
        owner {
            displayName
        }
        relatedChannelConfigurations {
            results {
                deployment {
                    name
                    campaign {
                        name
                    }
                    site {
                        name
                    }
                    project {
                        name
                    }
                }
                recorderSpecification {
                    recorder {
                        serialNumber
                        model
                    }
                    hydrophone {
                        serialNumber
                        model
                    }
                }
                detectorSpecification {
                    detector {
                        serialNumber
                        model
                    }
                }
            }
        }
    }
}
"""


class DatasetByPkTestCase(GraphQLTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ["users", *DATA_FIXTURES]

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.query(QUERY, variables={"pk": 1})
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected(self):
        self.client.login(username="user1", password="osmose29")
        response = self.query(QUERY, variables={"pk": 1})
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)["data"]["datasetByPk"]
        self.assertEqual(content["name"], "gliderSPAmsDemo")
        self.assertEqual(content["path"], "gliderSPAmsDemo")
        self.assertEqual(content["start"], "2012-10-03T10:00:00+00:00")
        self.assertEqual(content["end"], "2012-10-03T20:15:00+00:00")
        self.assertEqual(len(content["relatedChannelConfigurations"]["results"]), 0)
