from django_extension.schema.types import ExtendedNode

from backend.api.models import AnnotationComment
from backend.api.schema.filter_sets import AnnotationCommentFilterSet


class AnnotationCommentNode(ExtendedNode):
    """AnnotationComment schema"""

    class Meta:
        model = AnnotationComment
        fields = "__all__"
        filterset_class = AnnotationCommentFilterSet
