from graphene import Int

from backend.api.models import Spectrogram
from backend.api.schema.filter_sets import SpectrogramFilterSet
from backend.utils.schema.types import BaseObjectType, BaseNode


class SpectrogramNode(BaseObjectType):
    """Spectrogram schema"""

    duration = Int(required=True)

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Spectrogram
        fields = "__all__"
        filterset_class = SpectrogramFilterSet
        interfaces = (BaseNode,)
