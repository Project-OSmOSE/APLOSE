import graphene
from django.db.models import QuerySet, Count, Min, Max
from django_extension.schema.fields import AuthenticatedPaginationConnectionField
from django_extension.schema.types import ExtendedNode
from graphql import GraphQLResolveInfo

from backend.api.models import Dataset
from backend.api.schema.filter_sets import DatasetFilterSet
from .spectrogram_analysis import SpectrogramAnalysisNode


class DatasetNode(ExtendedNode):
    """Dataset schema"""

    spectrogram_analysis = AuthenticatedPaginationConnectionField(
        SpectrogramAnalysisNode
    )

    analysis_count = graphene.Int(required=True)
    spectrogram_count = graphene.Int(required=True)
    start = graphene.DateTime()
    end = graphene.DateTime()

    class Meta:
        model = Dataset
        fields = "__all__"
        filterset_class = DatasetFilterSet

    @classmethod
    def resolve_queryset(cls, queryset: QuerySet, info: GraphQLResolveInfo):
        return (
            super()
            .resolve_queryset(queryset, info)
            .annotate(
                analysis_count=Count("spectrogram_analysis", distinct=True),
                spectrogram_count=Count(
                    "spectrogram_analysis__spectrograms", distinct=True
                ),
                start=Min("spectrogram_analysis__start"),
                end=Max("spectrogram_analysis__end"),
            )
        )
