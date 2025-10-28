from graphene_django.filter import TypedFilter

from backend.api.models import AnnotationFileRange
from backend.api.schema.enums import AnnotationPhaseType
from backend.utils.schema.filters import BaseFilterSet


class AnnotationFileRangeFilterSet(BaseFilterSet):
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
            "annotator": ("exact",),
            "annotation_phase__annotation_campaign": ("exact",),
        }
