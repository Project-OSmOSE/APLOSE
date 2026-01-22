from django_extension.schema.types import ExtendedEnumType

from backend.api.models import AnnotationPhase


class AnnotationPhaseType(ExtendedEnumType):
    """From AnnotationPhase.Type"""

    class Meta:
        enum = AnnotationPhase.Type

    Annotation = "A"
    Verification = "V"
