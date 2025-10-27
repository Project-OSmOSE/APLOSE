from django.db.models import Count, Min, Max, QuerySet
from graphene import Int, DateTime
from graphql import GraphQLResolveInfo

from backend.api.models import Dataset
from backend.api.schema.connections import SpectrogramConnection
from backend.api.schema.filter_sets import DatasetFilterSet
from backend.api.schema.nodes import SpectrogramAnalysisNode
from backend.utils.schema.types import BaseObjectType, BaseNode


class DatasetNode(BaseObjectType):
    """Dataset schema"""

    files_count = Int()
    start = DateTime()
    end = DateTime()

    spectrogram_analysis = SpectrogramConnection(SpectrogramAnalysisNode)

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Dataset
        fields = "__all__"
        filterset_class = DatasetFilterSet
        interfaces = (BaseNode,)

    @classmethod
    def resolve_queryset(cls, queryset: QuerySet, info: GraphQLResolveInfo):
        return (
            super()
            .resolve_queryset(queryset, info)
            .annotate(
                files_count=Count("spectrogram_analysis__spectrograms", distinct=True),
                start=Min("spectrogram_analysis__spectrograms__start"),
                end=Max("spectrogram_analysis__spectrograms__end"),
            )
        )
