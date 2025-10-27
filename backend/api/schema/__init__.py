"""API GraphQL schemas"""
import graphene

from .annotation import AnnotationMutation, AnnotationQuery
from .data import DataQuery, DataMutation
from .queries import AllSpectrogramAnalysisField


class APIMutation(
    AnnotationMutation,
    DataMutation,
    graphene.ObjectType,
):  # pylint: disable=too-few-public-methods
    """API GraphQL mutations"""


class APIQuery(
    AnnotationQuery,
    DataQuery,
    graphene.ObjectType,
):  # pylint: disable=too-few-public-methods
    """API GraphQL queries"""

    all_spectrogram_analysis = AllSpectrogramAnalysisField
