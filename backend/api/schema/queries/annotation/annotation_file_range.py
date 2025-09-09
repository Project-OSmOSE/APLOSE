"""AnnotationFileRange schema"""
from django_filters import FilterSet
from graphene import relay, ObjectType, Field
from graphene_django.filter import TypedFilter

from backend.api.models import AnnotationFileRange, Spectrogram
from backend.utils.schema import (
    ApiObjectType,
    GraphQLResolve,
    GraphQLPermissions,
    AuthenticatedDjangoConnectionField,
    PKFilter,
    PK,
)
from .annotation_phase import AnnotationPhaseType


class AnnotationFileRangeFilter(FilterSet):
    """AnnotationFileRange filters"""

    annotator_id = PKFilter(field_name="annotator_id")
    annotation_campaign_id = PKFilter(
        field_name="annotation_phase__annotation_campaign"
    )
    phase_type = TypedFilter(
        input_type=AnnotationPhaseType,
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


class AnnotationFileRangeQuery(ObjectType):  # pylint: disable=too-few-public-methods
    """AnnotationFileRange queries"""

    all_annotation_file_ranges = AuthenticatedDjangoConnectionField(
        AnnotationFileRangeNode
    )
    annotation_file_range = Field(
        AnnotationFileRangeNode,
        spectrogram_id=PK(required=True),
        annotator_id=PK(required=True),
        annotation_campaign_id=PK(required=True),
        phase_type=AnnotationPhaseType(required=True),
    )

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def resolve_annotation_file_range(
        self,
        info,
        spectrogram_id: int,
        annotator_id: int,
        annotation_campaign_id: int,
        phase_type: AnnotationPhaseType,
    ):  # pylint: disable=redefined-builtin
        """Get AnnotationCampaign by id"""
        spectrogram = Spectrogram.objects.get(id=spectrogram_id)
        return AnnotationFileRange.objects.get(
            annotation_phase__annotation_campaign_id=annotation_campaign_id,
            annotation_phase__phase=phase_type.value,
            annotator_id=annotator_id,
            from_datetime__lte=spectrogram.start,
            to_datetime__gte=spectrogram.end,
        )
