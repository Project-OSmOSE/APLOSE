from graphene_django.filter import TypedFilter

from backend.api.models import AnnotationFileRange
from backend.api.schema.enums import AnnotationPhaseType
from backend.api.schema.nodes import SpectrogramNode
from backend.utils.schema import AuthenticatedDjangoConnectionField
from backend.utils.schema.filters import BaseFilterSet
from backend.utils.schema.types import BaseObjectType, BaseNode
from .context_filter import AnnotationFileRangeContextFilter
from ..annotation_task.task_node import AnnotationTaskNode


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

    annotation_tasks = AuthenticatedDjangoConnectionField(
        AnnotationTaskNode, source="tasks"
    )

    spectrograms = AuthenticatedDjangoConnectionField(SpectrogramNode)

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationFileRange
        fields = "__all__"
        filterset_class = AnnotationFileRangeFilter
        context_filter = AnnotationFileRangeContextFilter
        interfaces = (BaseNode,)
