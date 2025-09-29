"""APLOSE user schema"""
from graphene import ObjectType, Field

from backend.utils.schema import (
    AuthenticatedDjangoConnectionField,
    GraphQLResolve,
    GraphQLPermissions,
)
from .update_password_mutation import UpdatePasswordMutation
from .update_user_mutation import UpdateUserMutation
from .user_node import UserNode


class UserQuery(ObjectType):
    """User queries"""

    all_users = AuthenticatedDjangoConnectionField(UserNode)
    current_user = Field(UserNode)

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def resolve_current_user(self, info):
        """Get current user"""
        return UserNode.get_node(info, info.context.user.id)


class UserMutation(ObjectType):  # pylint: disable=too-few-public-methods
    """User mutations"""

    user_update_password = UpdatePasswordMutation.Field()
    current_user_update = UpdateUserMutation.Field()
