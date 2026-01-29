from django_extension.schema.types import ExtendedEnumType

from backend.api.models import Annotation


class AnnotationType(ExtendedEnumType):
    """From Annotation.Type"""

    class Meta:
        enum = Annotation.Type

    Weak = "W"
    Point = "P"
    Box = "B"
