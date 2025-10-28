"""AnnotationValidation schema"""

from backend.api.models import AnnotationValidation
from backend.api.schema.filter_sets import AnnotationValidationFilterSet
from backend.utils.schema.types import BaseObjectType, BaseNode


class AnnotationValidationNode(BaseObjectType):
    """AnnotationValidation schema"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationValidation
        fields = "__all__"
        filterset_class = AnnotationValidationFilterSet
        interfaces = (BaseNode,)
