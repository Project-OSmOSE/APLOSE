"""User GraphQL definitions"""

from django.db.models import QuerySet, F, Value, CharField, Case, When, Q, BooleanField
from django.db.models.functions import Concat
from graphene import (
    String,
    Boolean,
)
from graphql import GraphQLResolveInfo

from backend.aplose.models import User
from backend.aplose.schema.enums import ExpertiseLevelType
from backend.utils.schema.types import BaseObjectType, BaseNode


class UserNode(BaseObjectType):
    """User node"""

    class Meta:
        model = User
        exclude = ("password",)
        filter_fields = {}
        interfaces = (BaseNode,)

    expertise = ExpertiseLevelType()
    display_name = String(required=True)
    is_admin = Boolean(required=True)

    @classmethod
    def resolve_queryset(cls, queryset: QuerySet, info: GraphQLResolveInfo):
        return (
            super()
            .resolve_queryset(queryset, info)
            .annotate(
                expertise=F("aplose__expertise_level"),
                is_admin=Case(
                    When(is_superuser=True, then=True),
                    When(is_staff=True, then=True),
                    default=Value(False),
                    output_field=BooleanField(),
                ),
                display_name=Case(
                    When(
                        ~Q(
                            first_name="",
                            last_name="",
                        ),
                        then=Concat(
                            F("first_name"),
                            Value(" "),
                            F("last_name"),
                            output_field=CharField(),
                        ),
                    ),
                    default=F("username"),
                    output_field=CharField(),
                ),
            )
        )
