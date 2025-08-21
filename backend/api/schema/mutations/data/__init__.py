"""API GraphQL mutations data"""
import graphene

from .dataset import DatasetMutation
from .spectrogram_analysis import SpectrogramAnalysisMutation


class APIDataMutation(
    DatasetMutation,
    SpectrogramAnalysisMutation,
    graphene.ObjectType,
):  # pylint: disable=too-few-public-methods
    """API GraphQL mutations"""
