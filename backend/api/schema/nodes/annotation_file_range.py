from backend.api.models import AnnotationFileRange
from backend.api.schema.context_filters import AnnotationFileRangeContextFilter
from backend.api.schema.filter_sets import AnnotationFileRangeFilterSet
from backend.utils.schema import AuthenticatedDjangoConnectionField
from backend.utils.schema.types import BaseObjectType, BaseNode
from .annotation_task import AnnotationTaskNode
from .spectrogram import SpectrogramNode


class AnnotationFileRangeNode(BaseObjectType):
    """AnnotationFileRange schema"""

    annotation_tasks = AuthenticatedDjangoConnectionField(
        AnnotationTaskNode, source="tasks"
    )

    spectrograms = AuthenticatedDjangoConnectionField(SpectrogramNode)

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationFileRange
        fields = "__all__"
        filterset_class = AnnotationFileRangeFilterSet
        context_filter = AnnotationFileRangeContextFilter
        interfaces = (BaseNode,)
