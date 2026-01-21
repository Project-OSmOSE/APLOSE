from django_extension.schema.fields import AuthenticatedPaginationConnectionField
from django_extension.schema.types import ExtendedNode

from backend.api.models import AnnotationFileRange
from backend.api.schema.filter_sets import AnnotationFileRangeFilterSet
from .annotation_task import AnnotationTaskNode
from .spectrogram import SpectrogramNode


class AnnotationFileRangeNode(ExtendedNode):
    """AnnotationFileRange schema"""

    annotation_tasks = AuthenticatedPaginationConnectionField(
        AnnotationTaskNode, source="tasks"
    )

    spectrograms = AuthenticatedPaginationConnectionField(SpectrogramNode)

    class Meta:
        model = AnnotationFileRange
        fields = "__all__"
        filterset_class = AnnotationFileRangeFilterSet
