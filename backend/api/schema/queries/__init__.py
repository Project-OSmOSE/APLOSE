"""API GraphQL queries"""
import graphene

from .annotation import APIAnnotationQuery
from .data import APIDataQuery


class APIQuery(
    APIAnnotationQuery,
    APIDataQuery,
    graphene.ObjectType,
):  # pylint: disable=too-few-public-methods
    """API GraphQL queries"""
