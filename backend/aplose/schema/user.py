"""User GraphQL definitions"""
import graphene_django_optimizer
from graphene import relay, String

from backend.aplose.models import User
from backend.utils.schema import ApiObjectType


class UserNode(ApiObjectType):
    """User node"""

    display_name = String(required=True)

    class Meta:
        # pylint: disable=too-few-public-methods, missing-class-docstring
        model = User
        fields = "__all__"
        filter_fields = "__all__"
        interfaces = (relay.Node,)

    @graphene_django_optimizer.resolver_hints()
    def resolve_display_name(root, info):
        return "{} {}".format(root.first_name, root.last_name)
