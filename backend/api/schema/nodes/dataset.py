import graphene
from django.db.models import QuerySet, Count, Min, Max
from graphql import GraphQLResolveInfo

from backend.api.models import Dataset
from backend.api.schema.filter_sets import DatasetFilterSet
from backend.utils.schema import AuthenticatedDjangoConnectionField
from backend.utils.schema.types import BaseObjectType, BaseNode
from .spectrogram_analysis import SpectrogramAnalysisNode


class DatasetNode(BaseObjectType):
    """Dataset schema"""

    spectrogram_analysis = AuthenticatedDjangoConnectionField(SpectrogramAnalysisNode)

    analysis_count = graphene.Int(required=True)
    spectrogram_count = graphene.Int(required=True)
    start = graphene.DateTime()
    end = graphene.DateTime()

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
                analysis_count=Count("spectrogram_analysis", distinct=True),
                spectrogram_count=Count(
                    "spectrogram_analysis__spectrograms", distinct=True
                ),
                start=Min("spectrogram_analysis__spectrograms__start"),
                end=Max("spectrogram_analysis__spectrograms__end"),
            )
        )
