"""AnnotationValidation schema"""
from django_extension.schema.types import ExtendedNode

from backend.api.models import AnnotationValidation
from backend.api.schema.filter_sets import AnnotationValidationFilterSet


class AnnotationValidationNode(ExtendedNode):
    """AnnotationValidation schema"""

    class Meta:
        model = AnnotationValidation
        fields = "__all__"
        filterset_class = AnnotationValidationFilterSet
