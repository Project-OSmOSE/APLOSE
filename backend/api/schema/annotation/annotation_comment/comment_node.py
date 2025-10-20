from backend.api.models import AnnotationComment
from backend.utils.schema.types import BaseObjectType, BaseNode


class AnnotationCommentNode(BaseObjectType):
    """AnnotationComment schema"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationComment
        fields = "__all__"
        filter_fields = {
            "annotation": ["isnull"],
            "author": ["exact"],
        }
        interfaces = (BaseNode,)
