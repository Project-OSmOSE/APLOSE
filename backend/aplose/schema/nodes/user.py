"""User GraphQL definitions"""

import graphene_django_optimizer
from django.db.models import QuerySet
from graphene import (
    String,
    Boolean,
)

from backend.aplose.models import User, AploseUser
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

    @graphene_django_optimizer.resolver_hints()
    def resolve_expertise(self: User, info):
        aplose: QuerySet[AploseUser] = AploseUser.objects.filter(user=self)
        if aplose.exists():
            return aplose.first().expertise_level
        return None

    display_name = String(required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_display_name(self: User, info):
        return self.get_full_name()

    is_admin = Boolean(required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_is_admin(self: User, info):
        # pylint: disable=no-member
        return self.is_superuser or self.is_staff
