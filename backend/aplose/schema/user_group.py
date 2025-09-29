"""User GraphQL definitions"""

from graphene import relay, ObjectType

from backend.aplose.models import AnnotatorGroup
from backend.utils.schema import (
    ApiObjectType,
    AuthenticatedDjangoConnectionField,
)


class UserGroupNode(ApiObjectType):
    """User group node"""

    class Meta:
        # pylint: disable=too-few-public-methods, missing-class-docstring
        model = AnnotatorGroup
        fields = "__all__"
        filter_fields = {}
        interfaces = (relay.Node,)


class UserGroupQuery(ObjectType):
    """User group queries"""

    all_user_groups = AuthenticatedDjangoConnectionField(UserGroupNode)
