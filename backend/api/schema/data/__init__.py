"""Data schema"""
from graphene import ObjectType

from .dataset import DatasetQuery, DatasetMutation
from .scale import ScalesQuery
from .spectrogram import SpectrogramQuery
from .spectrogram_analysis import SpectrogramAnalysisQuery, SpectrogramAnalysisMutation


class DataQuery(
    DatasetQuery,
    ScalesQuery,
    SpectrogramQuery,
    SpectrogramAnalysisQuery,
    ObjectType,
):  # pylint: disable=too-few-public-methods
    """Data queries"""


class DataMutation(
    DatasetMutation,
    SpectrogramAnalysisMutation,
    ObjectType,
):  # pylint: disable=too-few-public-methods
    """Data mutations"""
