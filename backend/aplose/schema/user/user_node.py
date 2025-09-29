"""User GraphQL definitions"""

import graphene_django_optimizer
from django.db.models import QuerySet, ExpressionWrapper, F, CharField
from graphene import (
    relay,
    String,
    Boolean,
    Enum,
)
from graphql import GraphQLResolveInfo

from backend.aplose.models import User
from backend.utils.schema import (
    ApiObjectType,
)


class ExpertiseLevel(Enum):
    """From ExpertiseLevel"""

    Expert = "E"
    Average = "A"
    Novice = "N"


class UserNode(ApiObjectType):
    """User node"""

    display_name = String(required=True)
    is_admin = Boolean(required=True)
    expertise = ExpertiseLevel()

    class Meta:
        # pylint: disable=too-few-public-methods, missing-class-docstring
        model = User
        exclude = ("password",)
        filter_fields = {}
        interfaces = (relay.Node,)

    @graphene_django_optimizer.resolver_hints()
    def resolve_display_name(root: User, info):
        return "{} {}".format(root.first_name, root.last_name)

    @graphene_django_optimizer.resolver_hints()
    def resolve_is_admin(root: User, info):
        return root.is_superuser or root.is_staff

    @classmethod
    def get_queryset(cls, queryset: QuerySet, info: GraphQLResolveInfo):
        return graphene_django_optimizer.query(
            queryset.annotate(
                expertise=ExpressionWrapper(
                    F("aplose__expertise_level"), output_field=CharField()
                )
            ),
            info,
        )
