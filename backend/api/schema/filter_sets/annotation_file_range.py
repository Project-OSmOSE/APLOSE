from django_extension.filters import ExtendedFilterSet
from graphene_django.filter import TypedFilter

from backend.api.models import AnnotationFileRange
from backend.api.schema.enums import AnnotationPhaseType


class AnnotationFileRangeFilterSet(ExtendedFilterSet):
    """AnnotationFileRange filters"""

    # pylint: disable=duplicate-code
    annotation_phase__phase = TypedFilter(
        input_type=AnnotationPhaseType,
        field_name="annotation_phase__phase",
        lookup_expr="exact",
    )

    class Meta:
        model = AnnotationFileRange
        fields = {
            "annotator": ("exact",),
            "annotation_phase__annotation_campaign": ("exact",),
        }
