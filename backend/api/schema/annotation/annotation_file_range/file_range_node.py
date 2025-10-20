from graphene_django.filter import TypedFilter

from backend.api.models import AnnotationFileRange
from backend.utils.schema import AuthenticatedDjangoConnectionField
from backend.utils.schema.filters import BaseFilterSet
from backend.utils.schema.types import BaseObjectType, BaseNode
from ..annotation_phase.phase_node import AnnotationPhaseType
from ..annotation_task.task_node import AnnotationTaskNode
from ...data.spectrogram.spectrogram_node import SpectrogramNode


class AnnotationFileRangeFilter(BaseFilterSet):
    """AnnotationFileRange filters"""

    annotation_phase__phase = TypedFilter(
        input_type=AnnotationPhaseType,
        field_name="annotation_phase__phase",
        lookup_expr="exact",
    )

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationFileRange
        fields = {
            "annotation_phase__annotation_campaign": ("exact",),
        }


class AnnotationFileRangeNode(BaseObjectType):
    """AnnotationFileRange schema"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationFileRange
        fields = "__all__"
        filterset_class = AnnotationFileRangeFilter
        interfaces = (BaseNode,)

    annotation_tasks = AuthenticatedDjangoConnectionField(AnnotationTaskNode)

    def resolve_annotation_tasks(self: AnnotationFileRange, info):
        return self.tasks

    spectrograms = AuthenticatedDjangoConnectionField(SpectrogramNode)

    def resolve_spectrograms(self: AnnotationFileRange, info):
        return self.spectrograms
