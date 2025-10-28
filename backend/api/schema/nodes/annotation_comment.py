from backend.api.models import AnnotationComment
from backend.api.schema.filter_sets import AnnotationCommentFilterSet
from backend.utils.schema.types import BaseObjectType, BaseNode


class AnnotationCommentNode(BaseObjectType):
    """AnnotationComment schema"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationComment
        fields = "__all__"
        filterset_class = AnnotationCommentFilterSet
        interfaces = (BaseNode,)
