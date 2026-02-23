from graphene import Float

from backend.api.models import Spectrogram
from backend.api.schema.filter_sets import SpectrogramFilterSet
from backend.utils.schema.types import BaseObjectType, BaseNode


class SpectrogramNode(BaseObjectType):
    """Spectrogram schema"""

    duration = Float(required=True)

    class Meta:
        model = Spectrogram
        fields = "__all__"
        filterset_class = SpectrogramFilterSet
        interfaces = (BaseNode,)
