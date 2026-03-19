from django_extension.models import ExtendedEnum


class TaskStatus(ExtendedEnum):
    PENDING = ("PENDING", "Pending")
    PROCESSING = ("PROCESS", "Processing")
    COMPLETED = ("COMPLETE", "Completed")
    FAILED = ("FAIL", "Failed")
    CANCELLED = ("CANCEL", "Cancelled")
    PAUSE = ("PAUSE", "Cancelled")


class TaskType(ExtendedEnum):

    ANALYSIS_IMPORT = ("A", "Analysis Import")


__all__ = [
    "TaskStatus",
    "TaskType",
]
