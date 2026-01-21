from django_extension.schema.types import ExtendedNode
from graphene import Int

from backend.api.models import Spectrogram
from backend.api.schema.filter_sets import SpectrogramFilterSet


class SpectrogramNode(ExtendedNode):
    """Spectrogram schema"""

    duration = Int(required=True)

    class Meta:
        model = Spectrogram
        fields = "__all__"
        filterset_class = SpectrogramFilterSet
