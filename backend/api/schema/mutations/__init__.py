"""API GraphQL mutations"""
import graphene

from .annotation import APIAnnotationMutation
from .data import APIDataMutation


class APIMutation(
    APIDataMutation,
    APIAnnotationMutation,
    graphene.ObjectType,
):  # pylint: disable=too-few-public-methods
    """API GraphQL mutations"""
