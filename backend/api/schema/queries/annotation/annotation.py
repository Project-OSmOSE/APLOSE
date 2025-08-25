"""Annotation schema"""
from django_filters import FilterSet, CharFilter
from graphene import relay
from graphene_django.filter import GlobalIDFilter

from backend.api.models import Annotation
from backend.utils.schema import ApiObjectType


class AnnotationFilter(FilterSet):
    """Annotation filters"""

    annotation_campaign_id = GlobalIDFilter(
        field_name="annotation_phase__annotation_campaign_id",
        lookup_expr="exact",
        exclude=False,
    )
    phase_type = CharFilter(
        field_name="annotation_phase__phase",
        lookup_expr="exact",
        exclude=False,
    )

    annotator_id = GlobalIDFilter(
        field_name="annotator_id", lookup_expr="exact", exclude=False
    )
    not_annotator_id = GlobalIDFilter(
        field_name="annotator_id", lookup_expr="exact", exclude=True
    )

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Annotation
        fields = {
            "spectrogram_id": ["exact", "in"],
        }


class AnnotationNode(ApiObjectType):
    """Annotation schema"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Annotation
        fields = "__all__"
        filterset_class = AnnotationFilter
        interfaces = (relay.Node,)
