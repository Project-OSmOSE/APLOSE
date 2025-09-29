"""Label schema"""
from django_filters import FilterSet
from graphene import relay
from graphene_django.filter import TypedFilter

from backend.api.models import Label
from backend.utils.schema import ApiObjectType, PKFilter
from .annotation_phase import AnnotationPhaseType


class LabelFilterSet(FilterSet):
    """Label filter set"""

    used_in_annotations_of_campaign = PKFilter(
        field_name="annotation__annotation_phase__annotation_campaign_id",
    )
    used_in_annotations_of_phase = TypedFilter(
        input_type=AnnotationPhaseType,
        field_name="annotation__annotation_phase__phase",
    )
    used_in_annotations_by_user = PKFilter(
        field_name="annotation__annotator_id",
    )

    class Meta:
        model = Label
        fields = {}


class AnnotationLabelNode(ApiObjectType):
    """Label schema"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Label
        fields = "__all__"
        filterset_class = LabelFilterSet
        interfaces = (relay.Node,)
