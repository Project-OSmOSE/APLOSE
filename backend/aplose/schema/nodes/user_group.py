"""User GraphQL definitions"""
import graphene
import graphene_django_optimizer
from django_extension.schema.types import ExtendedNode

from backend.aplose.models import AnnotatorGroup
from .user import UserNode


class UserGroupNode(ExtendedNode):
    """User group node"""

    class Meta:
        model = AnnotatorGroup
        exclude = ("annotators",)
        filter_fields = {}

    users = graphene.List(UserNode)

    @graphene_django_optimizer.resolver_hints()
    def resolve_users(self: AnnotatorGroup, info):
        # pylint: disable=no-member
        return self.annotators.all()
