from django_extension.schema.fields import AuthenticatedPaginationConnectionField

from backend.api.models import AnnotationFileRange
from backend.api.schema.filter_sets import AnnotationFileRangeFilterSet
from backend.utils.schema.types import BaseObjectType, BaseNode
from .annotation_task import AnnotationTaskNode
from .spectrogram import SpectrogramNode


class AnnotationFileRangeNode(BaseObjectType):
    """AnnotationFileRange schema"""

    annotation_tasks = AuthenticatedPaginationConnectionField(
        AnnotationTaskNode, source="tasks"
    )

    spectrograms = AuthenticatedPaginationConnectionField(SpectrogramNode)

    class Meta:
        model = AnnotationFileRange
        fields = "__all__"
        filterset_class = AnnotationFileRangeFilterSet
        interfaces = (BaseNode,)
