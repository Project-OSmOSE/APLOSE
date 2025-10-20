import graphene

from backend.utils.schema import AuthenticatedDjangoConnectionField
from .spectrogram_node import SpectrogramNode


class SpectrogramQuery(graphene.ObjectType):  # pylint: disable=too-few-public-methods
    """Spectrogram queries"""

    all_spectrograms = AuthenticatedDjangoConnectionField(SpectrogramNode)
