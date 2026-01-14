import graphene
import graphene_django_optimizer

from backend.api.models import SpectrogramAnalysis
from backend.api.schema.connections import SpectrogramConnection
from backend.api.schema.filter_sets import SpectrogramAnalysisFilterSet
from backend.utils.schema.types import BaseObjectType, BaseNode
from .colormap import ColormapNode
from .fft import FFTNode
from .legacy_spectrogram_configuration import LegacySpectrogramConfigurationNode
from .spectrogram import SpectrogramNode


class SpectrogramAnalysisNode(BaseObjectType):
    """SpectrogramAnalysis schema"""

    fft = graphene.NonNull(FFTNode)
    colormap = graphene.NonNull(ColormapNode)
    legacy_configuration = LegacySpectrogramConfigurationNode()

    class Meta:
        model = SpectrogramAnalysis
        fields = "__all__"
        filterset_class = SpectrogramAnalysisFilterSet
        interfaces = (BaseNode,)

    spectrograms = SpectrogramConnection(SpectrogramNode)

    @graphene_django_optimizer.resolver_hints()
    def resolve_spectrograms(self: SpectrogramAnalysis, info, **kwargs):
        return self.spectrograms.distinct()
