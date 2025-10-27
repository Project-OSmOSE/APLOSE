import graphene_django_optimizer

from backend.api.models import Spectrogram, Dataset
from backend.api.schema.connections import SpectrogramConnection
from backend.api.schema.filter_sets import DatasetFilterSet
from backend.utils.schema import AuthenticatedDjangoConnectionField
from backend.utils.schema.types import BaseObjectType, BaseNode
from .spectrogram import SpectrogramNode
from .spectrogram_analysis import SpectrogramAnalysisNode


class DatasetNode(BaseObjectType):
    """Dataset schema"""

    spectrogram_analysis = AuthenticatedDjangoConnectionField(SpectrogramAnalysisNode)

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Dataset
        fields = "__all__"
        filterset_class = DatasetFilterSet
        interfaces = (BaseNode,)

    spectrograms = SpectrogramConnection(SpectrogramNode)

    @graphene_django_optimizer.resolver_hints()
    def resolve_spectrograms(self: Dataset, info, **kwargs):
        return Spectrogram.objects.filter(
            analysis__in=self.spectrogram_analysis.all()
        ).distinct()
