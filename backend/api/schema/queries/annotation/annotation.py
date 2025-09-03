"""Annotation schema"""
from django_filters import FilterSet
from graphene import relay, ID, Enum, NonNull
from graphene_django.filter import TypedFilter

from backend.api.models import Annotation
from backend.utils.schema import ApiObjectType, AuthenticatedDjangoConnectionField
from .annotation_phase import AnnotationPhaseType
from .annotation_validation import AnnotationValidationNode


class AnnotationType(Enum):
    """From Annotation.Type"""

    Weak = "W"
    Point = "P"
    Box = "B"


class AnnotationFilter(FilterSet):
    """Annotation filters"""

    annotation_campaign_id = TypedFilter(
        input_type=ID,
        field_name="annotation_phase__annotation_campaign_id",
        lookup_expr="exact",
        exclude=False,
    )
    phase_type = TypedFilter(
        input_type=AnnotationPhaseType,
        field_name="annotation_phase__phase",
        lookup_expr="exact",
        exclude=False,
        method="filter_phase_type",
    )
    spectrogram_id = TypedFilter(
        input_type=ID,
        field_name="spectrogram_id",
        lookup_expr="exact",
        exclude=False,
    )

    annotator_id = TypedFilter(
        input_type=ID, field_name="annotator_id", lookup_expr="exact", exclude=False
    )
    not_annotator_id = TypedFilter(
        input_type=ID, field_name="annotator_id", lookup_expr="exact", exclude=True
    )

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Annotation
        fields = {
            "spectrogram_id": ["exact", "in"],
        }


class AnnotationNode(ApiObjectType):
    """Annotation schema"""

    type = NonNull(AnnotationType)
    annotator_id = NonNull(ID)
    is_update_of_id = ID()
    validations = AuthenticatedDjangoConnectionField(AnnotationValidationNode)

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Annotation
        fields = "__all__"
        filterset_class = AnnotationFilter
        interfaces = (relay.Node,)
