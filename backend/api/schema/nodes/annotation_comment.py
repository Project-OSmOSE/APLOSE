from backend.api.models import AnnotationComment
from backend.api.schema.filter_sets import AnnotationCommentFilterSet
from backend.utils.schema.types import BaseObjectType, BaseNode


class AnnotationCommentNode(BaseObjectType):
    """AnnotationComment schema"""

    class Meta:
        model = AnnotationComment
        fields = "__all__"
        filterset_class = AnnotationCommentFilterSet
        interfaces = (BaseNode,)
