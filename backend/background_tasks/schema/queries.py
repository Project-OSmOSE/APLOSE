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
        redis = Redis()
        tasks = []
        import_task_identifier_start = (
            f"{ImportAnalysisBackgroundTask.__name__}:{TaskType.ANALYSIS_IMPORT.label}"
        )
        for key in redis.scan_iter():
            if isinstance(key, bytes):
                key = key.decode()
            if import_task_identifier_start in key and "path" not in key:
                tasks.append(ImportAnalysisBackgroundTask.get(identifier=key))
        return tasks


__all__ = [
    "BackgroundTasksQuery",
]
