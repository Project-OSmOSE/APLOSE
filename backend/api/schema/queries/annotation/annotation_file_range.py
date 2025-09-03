"""AnnotationFileRange schema"""
from django_filters import FilterSet
from graphene import relay, ObjectType, ID, Field
from graphene_django.filter import GlobalIDFilter, TypedFilter

from backend.api.models import AnnotationFileRange, Spectrogram
from backend.utils.schema import (
    ApiObjectType,
    GraphQLResolve,
    GraphQLPermissions,
    AuthenticatedDjangoConnectionField,
)
from .annotation_phase import AnnotationPhaseType


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
        spectrogram_id=ID(required=True),
        annotator_id=ID(required=True),
        annotation_campaign_id=ID(required=True),
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
