"""API GraphQL mutations"""
import graphene

from .annotation import APIAnnotationMutation


class APIMutation(
    APIAnnotationMutation,
    graphene.ObjectType,
):  # pylint: disable=too-few-public-methods
    """API GraphQL mutations"""
