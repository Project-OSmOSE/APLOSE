"""AnnotationComment schema"""
from django_filters import FilterSet
from graphene import relay, ID
from graphene_django.filter import TypedFilter

from backend.api.models import AnnotationComment
from backend.utils.schema import ApiObjectType
from .annotation_phase import AnnotationPhaseType


class AnnotationCommentFilter(FilterSet):
    """AnnotationFileRange filters"""

    author_id = TypedFilter(
        input_type=ID,
        field_name="author_id",
        lookup_expr="exact",
        exclude=False,
    )
    annotation_campaign_id = TypedFilter(
        input_type=ID,
        field_name="annotation_phase__annotation_campaign_id",
        lookup_expr="exact",
        exclude=False,
    )
    spectrogram_id = TypedFilter(
        input_type=ID,
        field_name="spectrogram_id",
        lookup_expr="exact",
        exclude=False,
    )
    phase_type = TypedFilter(
        input_type=AnnotationPhaseType,
        field_name="annotation_phase__phase",
        lookup_expr="exact",
        exclude=False,
    )

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationComment
        fields = {}


class AnnotationCommentNode(ApiObjectType):
    """AnnotationComment schema"""

    annotation_id = ID()

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationComment
        fields = "__all__"
        filterset_class = AnnotationCommentFilter
        interfaces = (relay.Node,)
