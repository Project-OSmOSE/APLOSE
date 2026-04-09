import graphene
from django_extension.schema.fields import ByIdField
from graphene import ObjectType
from redis import Redis

from .nodes import *
from backend.background_tasks.types import ImportAnalysisBackgroundTask, TaskType


class BackgroundTasksQuery(ObjectType):

    # Import analysis
    import_analysis_task_by_identifier = ByIdField(ImportAnalysisBackgroundTaskNode)
    all_import_analysis_tasks = graphene.List(ImportAnalysisBackgroundTaskNode)

    def resolve_all_import_analysis_tasks(self, info, **kwargs):
        return ImportAnalysisBackgroundTask.list()


__all__ = [
    "BackgroundTasksQuery",
]
