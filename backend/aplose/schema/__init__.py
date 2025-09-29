"""APLOSE queries"""
from graphene import ObjectType

from backend.aplose.schema.user import UserQuery, UserMutation
from backend.aplose.schema.user_group import UserGroupQuery


class AploseQuery(
    UserQuery,
    UserGroupQuery,
    ObjectType,
):  # pylint: disable=too-few-public-methods
    """APLOSE queries"""


class AploseMutation(
    UserMutation,
    ObjectType,
):  # pylint: disable=too-few-public-methods
    """APLOSE mutations"""
