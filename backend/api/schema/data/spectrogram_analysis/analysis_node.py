import graphene
from django.db.models import QuerySet, Count, Min, Max
from django_filters import OrderingFilter
from graphql import GraphQLResolveInfo

from backend.api.models import SpectrogramAnalysis
from backend.utils.schema.filters import BaseFilterSet
from backend.utils.schema.types import BaseObjectType, BaseNode
from ..colormap.colormap_node import ColormapNode
from ..fft.fft_node import FFTNode
from ..legacy_spectrogram_configuration.configuration_node import (
    LegacySpectrogramConfigurationNode,
)


class SpectrogramAnalysisFilter(BaseFilterSet):
    """SpectrogramAnalysis filters"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = SpectrogramAnalysis
        fields = {
            "dataset_id": [
                "exact",
            ],
            "annotation_campaigns__id": [
                "exact",
            ],
        }

    order_by = OrderingFilter(fields=("created_at", "name"))


class SpectrogramAnalysisNode(BaseObjectType):
    """SpectrogramAnalysis schema"""

    files_count = graphene.Int()
    start = graphene.DateTime()
    end = graphene.DateTime()

    fft = graphene.NonNull(FFTNode)
    colormap = graphene.NonNull(ColormapNode)
    legacy_configuration = LegacySpectrogramConfigurationNode()

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = SpectrogramAnalysis
        fields = "__all__"
        filterset_class = SpectrogramAnalysisFilter
        interfaces = (BaseNode,)

    @classmethod
    def resolve_queryset(cls, queryset: QuerySet, info: GraphQLResolveInfo):
        return (
            super()
            .resolve_queryset(queryset, info)
            .annotate(
                files_count=Count("spectrograms"),
                start=Min("spectrograms__start"),
                end=Max("spectrograms__end"),
            )
        )
