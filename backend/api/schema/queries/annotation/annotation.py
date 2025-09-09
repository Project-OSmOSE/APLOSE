"""Annotation schema"""
from django_filters import FilterSet
from graphene import relay, Enum, NonNull
from graphene_django.filter import TypedFilter

from backend.api.models import Annotation
from backend.utils.schema import (
    ApiObjectType,
    AuthenticatedDjangoConnectionField,
    PK,
    PKFilter,
    PKMultipleChoiceFilter,
)
from .annotation_phase import AnnotationPhaseType
from .annotation_validation import AnnotationValidationNode


class AnnotationType(Enum):
    """From Annotation.Type"""

    Weak = "W"
    Point = "P"
    Box = "B"


class AnnotationFilter(FilterSet):
    """Annotation filters"""

    annotation_campaign_id = PKFilter(
        field_name="annotation_phase__annotation_campaign_id"
    )
    phase_type = TypedFilter(
        input_type=AnnotationPhaseType,
        field_name="annotation_phase__phase",
        lookup_expr="exact",
        method="filter_phase_type",
        distinct=True,
    )
    spectrogram_id = PKFilter(field_name="spectrogram_id")
    spectrogram_id__in = PKMultipleChoiceFilter(field_name="spectrogram_id")

    annotator_id = PKFilter(field_name="annotator_id")
    not_annotator_id = PKFilter(field_name="annotator_id", exclude=True)

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Annotation
        fields = {}


class AnnotationNode(ApiObjectType):
    """Annotation schema"""

    type = NonNull(AnnotationType)
    annotator_id = PK(required=True)
    is_update_of_id = PK()
    validations = AuthenticatedDjangoConnectionField(AnnotationValidationNode)

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Annotation
        fields = "__all__"
        filterset_class = AnnotationFilter
        interfaces = (relay.Node,)
