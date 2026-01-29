from django_extension.schema.types import ExtendedEnumType

from backend.api.models import AnnotationTask


class AnnotationTaskStatus(ExtendedEnumType):
    """From AnnotationTask.Status"""

    class Meta:
        enum = AnnotationTask.Status

    Created = "C"
    Finished = "F"
