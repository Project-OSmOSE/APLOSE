"""API GraphQL schemas"""
import graphene

from .annotation import AnnotationMutation, AnnotationQuery
from .data import DataQuery, DataMutation
from .mutations import APIMutation as _APIMutation
from .queries import APIQuery as _APIQuery


class APIMutation(
    AnnotationMutation,
    DataMutation,
    # _APIMutation,
    graphene.ObjectType,
):  # pylint: disable=too-few-public-methods
    """API GraphQL mutations"""


class APIQuery(
    AnnotationQuery,
    DataQuery,
    _APIQuery,
    graphene.ObjectType,
):  # pylint: disable=too-few-public-methods
    """API GraphQL queries"""
