"""Data related schema"""

import graphene

from .colormap__query import ColormapQuery
from .dataset__mutation import DatasetMutation
from .dataset__query import DatasetQuery
from .fft__query import FFTQuery
from .legacy_spectrogram_configuration__query import LegacySpectrogramConfigurationQuery
from .scales__query import ScalesQuery
from .spectrogram__query import SpectrogramQuery
from .spectrogram_analysis__mutation import SpectrogramAnalysisMutation
from .spectrogram_analysis__query import SpectrogramAnalysisQuery


class APIDataQuery(
    ColormapQuery,
    DatasetQuery,
    FFTQuery,
    LegacySpectrogramConfigurationQuery,
    ScalesQuery,
    SpectrogramQuery,
    SpectrogramAnalysisQuery,
    graphene.ObjectType,
):  # pylint: disable=too-few-public-methods
    """API GraphQL queries"""


class APIDataMutation(
    DatasetMutation,
    SpectrogramAnalysisMutation,
    graphene.ObjectType,
):  # pylint: disable=too-few-public-methods
    """API GraphQL mutations"""
