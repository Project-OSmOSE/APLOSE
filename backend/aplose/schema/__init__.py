"""APLOSE queries"""
from django_extension.schema.fields import AuthenticatedPaginationConnectionField
from graphene import ObjectType

from .mutations import UpdateUserPasswordMutation, UpdateUserMutation
from .nodes import UserGroupNode, UserNode
from .queries import CurrentUserField


class AploseQuery(ObjectType):
    """APLOSE queries"""

    all_user_groups = AuthenticatedPaginationConnectionField(UserGroupNode)

    all_users = AuthenticatedPaginationConnectionField(UserNode)

    current_user = CurrentUserField


class AploseMutation(ObjectType):
    """APLOSE mutations"""

    user_update_password = UpdateUserPasswordMutation.Field()
    current_user_update = UpdateUserMutation.Field()
