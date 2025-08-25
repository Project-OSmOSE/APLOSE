"""AnnotationFileRange schema"""
from django_filters import FilterSet, CharFilter
from graphene import relay
from graphene_django.filter import GlobalIDFilter

from backend.api.models import AnnotationFileRange
from backend.utils.schema import ApiObjectType


class AnnotationFileRangeFilter(FilterSet):
    """AnnotationFileRange filters"""

    annotator_id = GlobalIDFilter(
        field_name="annotator_id", lookup_expr="exact", exclude=False
    )
    annotation_campaign_id = GlobalIDFilter(
        field_name="annotation_phase__annotation_campaign",
        lookup_expr="exact",
        exclude=False,
    )
    phase_type = CharFilter(
        field_name="annotation_phase__phase",
        lookup_expr="exact",
        exclude=False,
    )

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationFileRange
        fields = {}


class AnnotationFileRangeNode(ApiObjectType):
    """AnnotationFileRange schema"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationFileRange
        fields = "__all__"
        filterset_class = AnnotationFileRangeFilter
        interfaces = (relay.Node,)
