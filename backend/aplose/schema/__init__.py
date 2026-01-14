"""APLOSE queries"""
from graphene import ObjectType

from .mutations import UpdateUserPasswordMutation, UpdateUserMutation
from .nodes import UserGroupNode, UserNode
from .queries import AllUserGroupsField, AllUserField, CurrentUserField


class AploseQuery(ObjectType):
    """APLOSE queries"""

    all_user_groups = AllUserGroupsField

    all_users = AllUserField

    current_user = CurrentUserField


class AploseMutation(ObjectType):
    """APLOSE mutations"""

    user_update_password = UpdateUserPasswordMutation.Field()
    current_user_update = UpdateUserMutation.Field()
