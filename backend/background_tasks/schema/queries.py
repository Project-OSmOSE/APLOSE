from django_extension.schema.fields import ByIdField
from graphene import ObjectType
from graphene_django_pagination import DjangoPaginationConnectionField

from .nodes import *


class BackgroundTasksQuery(ObjectType):

    # Import analysis
    all_import_analysis_tasks = DjangoPaginationConnectionField(
        ImportAnalysisBackgroundTaskNode
    )
    import_analysis_task_by_id = ByIdField(ImportAnalysisBackgroundTaskNode)


__all__ = [
    "BackgroundTasksQuery",
]
