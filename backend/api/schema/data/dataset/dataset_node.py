from django.db.models import Count, Min, Max, QuerySet
from django_filters import FilterSet, OrderingFilter
from graphene import Int, DateTime
from graphql import GraphQLResolveInfo

from backend.api.models import Dataset
from backend.utils.schema.types import BaseObjectType, BaseNode


class DatasetFilter(FilterSet):
    """Dataset filters"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Dataset
        fields = {}

    order_by = OrderingFilter(fields=("created_at", "name"))


class DatasetNode(BaseObjectType):
    """Dataset schema"""

    analysis_count = Int()
    files_count = Int()
    start = DateTime()
    end = DateTime()

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Dataset
        fields = "__all__"
        filterset_class = DatasetFilter
        interfaces = (BaseNode,)

    @classmethod
    def resolve_queryset(cls, queryset: QuerySet, info: GraphQLResolveInfo):
        return (
            super()
            .resolve_queryset(queryset, info)
            .annotate(
                analysis_count=Count("spectrogram_analysis"),
                files_count=Count("spectrogram_analysis__spectrograms", distinct=True),
                start=Min("spectrogram_analysis__spectrograms__start"),
                end=Max("spectrogram_analysis__spectrograms__end"),
            )
        )
