from django_filters.rest_framework import FilterSet
from graphene_django.filter import TypedFilter

from backend.api.models import AnnotationComment
from backend.api.schema.enums import AnnotationPhaseType
from backend.utils.schema.types import BaseObjectType, BaseNode


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


class AnnotationCommentNode(BaseObjectType):
    """AnnotationComment schema"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationComment
        fields = "__all__"
        filterset_class = AnnotationCommentFilterSet
        interfaces = (BaseNode,)
