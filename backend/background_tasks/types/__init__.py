from ._background_task import AbstractBackgroundTask
from .enums import TaskType
from .exceptions import TaskNotFoundException
from .import_analysis import *

BackgroundTask = ImportAnalysisBackgroundTask  # | OtherBackgroundTask


def get_task(
    identifier,
) -> tuple[TaskType.ANALYSIS_IMPORT, ImportAnalysisBackgroundTask] | tuple[None, None]:
    _, type_label, uuid = identifier.split(":")
    if type_label == TaskType.ANALYSIS_IMPORT.label:
        return type_label, ImportAnalysisBackgroundTask.get(identifier)
    return None, None
