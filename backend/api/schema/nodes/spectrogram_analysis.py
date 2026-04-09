import graphene
import graphene_django_optimizer
from django_extension.schema.types import ExtendedNode

from backend.api.models import SpectrogramAnalysis
from backend.api.schema.connections import SpectrogramConnection
from backend.api.schema.filter_sets import SpectrogramAnalysisFilterSet
from backend.background_tasks.schema import ImportAnalysisBackgroundTaskNode
from backend.background_tasks.types import ImportAnalysisBackgroundTask
from backend.storage.utils import clean_path
from .colormap import ColormapNode
from .fft import FFTNode
from .legacy_spectrogram_configuration import LegacySpectrogramConfigurationNode
from .spectrogram import SpectrogramNode


class SpectrogramAnalysisNode(ExtendedNode):
    """SpectrogramAnalysis schema"""

    fft = graphene.NonNull(FFTNode)
    colormap = graphene.NonNull(ColormapNode)
    legacy_configuration = LegacySpectrogramConfigurationNode()

    class Meta:
        model = SpectrogramAnalysis
        fields = "__all__"
        filterset_class = SpectrogramAnalysisFilterSet

    spectrograms = SpectrogramConnection(SpectrogramNode)

    @graphene_django_optimizer.resolver_hints()
    def resolve_spectrograms(self: SpectrogramAnalysis, info, **kwargs):
        return self.spectrograms.distinct()

    import_task = graphene.Field(ImportAnalysisBackgroundTaskNode)

    def resolve_import_task(self: SpectrogramAnalysis, info, **kwargs):
        return ImportAnalysisBackgroundTask.get_from_path(
            path=clean_path(self.full_path)
        )
