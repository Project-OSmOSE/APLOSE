import graphene
from django_extension.schema.types import ExtendedEnumType

from backend.background_tasks.types import TaskType


class TaskStatusEnum(graphene.Enum):

    PENDING = "PENDING"
    STARTED = "STARTED"
    SUCCESS = "SUCCESS"
    FAILURE = "FAILURE"
    REVOKED = "REVOKED"
    RETRY = "RETRY"


class TaskTypeEnum(ExtendedEnumType):
    class Meta:
        enum = TaskType

    AnalysisImport = "A"


__all___ = [
    "TaskStatusEnum",
    "TaskTypeEnum",
]
