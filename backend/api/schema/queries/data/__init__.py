"""Data related schema"""

import graphene

from backend.api.schema.mutations.data.dataset import DatasetMutation
from backend.api.schema.mutations.data.spectrogram_analysis import (
    SpectrogramAnalysisMutation,
)
from .colormap import ColormapQuery
from .dataset import DatasetQuery
from .fft import FFTQuery
from .legacy_spectrogram_configuration import LegacySpectrogramConfigurationQuery
from .scales import ScalesQuery
from .spectrogram import SpectrogramQuery
from .spectrogram_analysis import SpectrogramAnalysisQuery


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
