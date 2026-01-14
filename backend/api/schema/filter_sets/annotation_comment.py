from django_filters.rest_framework import FilterSet
from graphene_django.filter import TypedFilter

from backend.api.models import AnnotationComment
from backend.api.schema.enums import AnnotationPhaseType


class AnnotationCommentFilterSet(FilterSet):

    annotation_phase__phase = TypedFilter(
        input_type=AnnotationPhaseType,
        field_name="annotation_phase__phase",
        lookup_expr="exact",
    )

    class Meta:
        model = AnnotationComment
        fields = {
            "annotation": ["isnull"],
            "author": ["exact"],
        }
