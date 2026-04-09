from django_extension.models import ExtendedEnum


class TaskType(ExtendedEnum):

    ANALYSIS_IMPORT = ("A", "Analysis Import")


__all__ = [
    "TaskType",
]
