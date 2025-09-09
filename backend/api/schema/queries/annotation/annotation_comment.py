"""AnnotationComment schema"""
from django_filters import FilterSet
from graphene import relay
from graphene_django.filter import TypedFilter

from backend.api.models import AnnotationComment
from backend.utils.schema import ApiObjectType, PKFilter, PK
from .annotation_phase import AnnotationPhaseType


class AnnotationCommentFilter(FilterSet):
    """AnnotationFileRange filters"""

    author_id = PKFilter(field_name="author_id")
    annotation_campaign_id = PKFilter(
        field_name="annotation_phase__annotation_campaign_id"
    )
    spectrogram_id = PKFilter(field_name="spectrogram_id")
    phase_type = TypedFilter(
        input_type=AnnotationPhaseType,
        field_name="annotation_phase__phase",
        lookup_expr="exact",
    )

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationComment
        fields = {}


class AnnotationCommentNode(ApiObjectType):
    """AnnotationComment schema"""

    annotation_id = PK()

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationComment
        fields = "__all__"
        filterset_class = AnnotationCommentFilter
        interfaces = (relay.Node,)
