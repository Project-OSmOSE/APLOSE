"""AnnotationValidation schema"""

from backend.api.models import AnnotationValidation
from backend.utils.schema.types import BaseObjectType, BaseNode
from .filterset import AnnotationValidationFilterSet


class AnnotationValidationNode(BaseObjectType):
    """AnnotationValidation schema"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationValidation
        fields = "__all__"
        filterset_class = AnnotationValidationFilterSet
        interfaces = (BaseNode,)
