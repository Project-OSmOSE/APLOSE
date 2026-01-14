"""User GraphQL definitions"""
import graphene
import graphene_django_optimizer
from graphene import relay

from backend.aplose.models import AnnotatorGroup
from backend.utils.schema.types import BaseObjectType
from .user import UserNode


class UserGroupNode(BaseObjectType):
    """User group node"""

    class Meta:
        model = AnnotatorGroup
        exclude = ("annotators",)
        filter_fields = {}
        interfaces = (relay.Node,)

    users = graphene.List(UserNode)

    @graphene_django_optimizer.resolver_hints()
    def resolve_users(self: AnnotatorGroup, info):
        # pylint: disable=no-member
        return self.annotators.all()
