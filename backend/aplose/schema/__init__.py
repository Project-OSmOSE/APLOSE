"""APLOSE queries"""
from graphene import ObjectType

from backend.utils.schema import (
    GraphQLPermissions,
    GraphQLResolve,
)
from .mutations import UpdateUserPasswordMutation, UpdateUserMutation
from .nodes import UserGroupNode, UserNode
from .queries import AllUserGroupsField, AllUserField, CurrentUserField


class AploseQuery(
    ObjectType,
):  # pylint: disable=too-few-public-methods
    """APLOSE queries"""

    all_user_groups = AllUserGroupsField

    all_users = AllUserField

    current_user = CurrentUserField

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def resolve_current_user(self, info):
        """Get current user"""
        return UserNode.get_node(info, info.context.user.id)


class AploseMutation(
    ObjectType,
):  # pylint: disable=too-few-public-methods
    """APLOSE mutations"""

    user_update_password = UpdateUserPasswordMutation.Field()
    current_user_update = UpdateUserMutation.Field()
