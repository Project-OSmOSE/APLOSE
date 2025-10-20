"""Data related schema"""

import graphene


# from .spectrogram import SpectrogramQuery


class APIDataQuery(
    # SpectrogramQuery,
    graphene.ObjectType,
):  # pylint: disable=too-few-public-methods
    """API GraphQL queries"""
