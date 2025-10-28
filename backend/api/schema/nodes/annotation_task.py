from backend.api.models import (
    AnnotationTask,
)
from backend.api.schema.enums import AnnotationTaskStatus
from backend.api.schema.filter_sets import AnnotationTaskFilterSet
from backend.utils.schema import AuthenticatedDjangoConnectionField
from backend.utils.schema.types import BaseObjectType, BaseNode
from .annotation import AnnotationNode
from .annotation_comment import AnnotationCommentNode


class AnnotationTaskNode(BaseObjectType):
    """AnnotationTask schema"""

    status = AnnotationTaskStatus(required=True)

    annotations = AuthenticatedDjangoConnectionField(AnnotationNode)
    comments = AuthenticatedDjangoConnectionField(AnnotationCommentNode)

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationTask
        fields = "__all__"
        filterset_class = AnnotationTaskFilterSet
        interfaces = (BaseNode,)
