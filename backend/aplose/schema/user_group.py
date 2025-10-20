"""User GraphQL definitions"""

from graphene import relay, ObjectType, List

from backend.aplose.models import AnnotatorGroup
from backend.utils.schema import (
    AuthenticatedDjangoConnectionField,
)
from backend.utils.schema.types import BaseObjectType
from .user import UserNode


class UserGroupNode(BaseObjectType):
    """User group node"""

    users = List(UserNode, source="annotators")

    class Meta:
        # pylint: disable=too-few-public-methods, missing-class-docstring
        model = AnnotatorGroup
        exclude = ("annotators",)
        filter_fields = {}
        interfaces = (relay.Node,)


class UserGroupQuery(ObjectType):
    """User group queries"""

    all_user_groups = AuthenticatedDjangoConnectionField(UserGroupNode)
