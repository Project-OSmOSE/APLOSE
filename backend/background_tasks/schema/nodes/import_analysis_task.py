import graphene
from django.db.models import QuerySet
from graphql import GraphQLResolveInfo

from backend.background_tasks.models import ImportAnalysisBackgroundTask
from .background_task import BackgroundTaskNode


class ImportAnalysisBackgroundTaskNode(BackgroundTaskNode):

    total_spectrograms = graphene.Int()
    completed_spectrograms = graphene.Int(required=True)
    chunk_size = graphene.Int(required=True)

    class Meta:
        model = ImportAnalysisBackgroundTask
        fields = "__all__"
        filter_fields = "__all__"
        order_by = ["-completed_spectrograms", "-total_spectrograms"]

    @classmethod
    def resolve_queryset(cls, queryset: QuerySet, info: GraphQLResolveInfo):
        return super().resolve_queryset(queryset, info).order_by("-created_at")


__all__ = ["ImportAnalysisBackgroundTaskNode"]
