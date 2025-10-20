from graphene import ObjectType, Field, ID

from backend.api.models import AnnotationPhase
from backend.utils.schema import (
    AuthenticatedDjangoConnectionField,
    GraphQLPermissions,
    GraphQLResolve,
)
from .create_phase_mutation import CreateAnnotationPhase
from .end_phase_mutation import EndAnnotationPhaseMutation
from .phase_node import AnnotationPhaseNode, AnnotationPhaseType
from .update_file_ranges import UpdateAnnotationPhaseFileRanges


class AnnotationPhaseQuery(ObjectType):  # pylint: disable=too-few-public-methods
    """AnnotationPhase queries"""

    all_annotation_phases = AuthenticatedDjangoConnectionField(AnnotationPhaseNode)

    annotation_phase_by_campaign_phase = Field(
        AnnotationPhaseNode,
        campaign_id=ID(required=True),
        phase_type=AnnotationPhaseType(required=True),
    )

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def resolve_annotation_phase_by_campaign_phase(
        self, info, campaign_id: int, phase_type: AnnotationPhaseType
    ):
        """Get AnnotationCampaign by id"""
        return AnnotationPhase.objects.get(
            annotation_campaign_id=campaign_id,
            phase=phase_type.value,
        )


class AnnotationPhaseMutation(ObjectType):  # pylint: disable=too-few-public-methods
    """AnnotationPhase mutations"""

    end_annotation_phase = EndAnnotationPhaseMutation.Field()

    create_annotation_phase = CreateAnnotationPhase.Field()

    update_annotation_phase_file_ranges = UpdateAnnotationPhaseFileRanges.Field()
