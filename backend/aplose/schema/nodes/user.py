"""User GraphQL definitions"""
from typing import Optional

import graphene_django_optimizer
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
        # pylint: disable=too-few-public-methods, missing-class-docstring
        model = User
        exclude = ("password",)
        filter_fields = {}
        interfaces = (BaseNode,)

    expertise = ExpertiseLevelType()

    @graphene_django_optimizer.resolver_hints()
    def resolve_expertise(root: User, info):
        aplose: Optional[AploseUser] = root.aplose
        return aplose.expertise_level if aplose else None

    display_name = String(required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_display_name(root: User, info):
        return "{} {}".format(root.first_name, root.last_name)

    is_admin = Boolean(required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_is_admin(root: User, info):
        return root.is_superuser or root.is_staff
