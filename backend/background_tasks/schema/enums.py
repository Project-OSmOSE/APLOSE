from django_extension.schema.types import ExtendedEnumType

from backend.background_tasks.models import TaskStatus, TaskType


class TaskStatusEnum(ExtendedEnumType):
    class Meta:
        enum = TaskStatus

    Pending = "PENDING"
    Processing = "PROCESS"
    Completed = "COMPLETE"
    Failed = "FAIL"
    Cancelled = "CANCEL"


class TaskTypeEnum(ExtendedEnumType):
    class Meta:
        enum = TaskType

    AnalysisImport = "A"


__all___ = [
    "TaskStatusEnum",
    "TaskTypeEnum",
]
