from ._enums import *
from .background_task import *
from .import_analysis_task import *


def get_instance_for_identifier(identifier: str) -> BackgroundTask:
    task_type, pk = identifier.split("-")
    if task_type == TaskType.ANALYSIS_IMPORT:
        return ImportAnalysisBackgroundTask.objects.get(pk=pk)
    return BackgroundTask.objects.get(pk=pk)
