import json

from django_extension.tests import ExtendedTestCase

from backend.aplose.models import User, AploseUser, LabelDisplayPreference

QUERY = """
mutation ($preference: LabelDisplayPreferenceType!) {
    currentUserUpdateLabelDisplayPreference(
        preference: $preference
    ) { ok }
}
"""
VARIABLES = {
    "preference": "English",
}


class UserUpdatePasswordTestCase(ExtendedTestCase):

    GRAPHQL_URL = "/api/graphql"
    fixtures = ["users"]

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        response = self.gql_query(QUERY, variables=VARIABLES)
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Unauthorized")

    def test_connected(self):
        user: User = User.objects.get(username="user1")

        response = self.gql_query(QUERY, user=user, variables={ "preference": "English" })
        self.assertResponseNoErrors(response)

        aplose_user: AploseUser = user.aplose
        self.assertEqual(aplose_user.label_display_preference, LabelDisplayPreference.ENGLISH)

        response = self.gql_query(QUERY, user=user, variables={ "preference": "French" })
        self.assertResponseNoErrors(response)

        aplose_user.refresh_from_db()
        self.assertEqual(aplose_user.label_display_preference, LabelDisplayPreference.FRENCH)
