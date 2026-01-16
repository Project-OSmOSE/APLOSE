import graphene

from backend.api.context_filters import (
    AnnotationCampaignContextFilter,
)
from backend.api.models import AnnotationCampaign
from backend.api.schema.enums import AnnotationPhaseType
from backend.api.schema.nodes import AnnotationPhaseNode
from backend.utils.schema import GraphQLPermissions, GraphQLResolve


@GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
def resolve_phase(self, info, campaign_id: int, phase_type: AnnotationPhaseType):
    """Get AnnotationPhase by campaignID and phase type"""
    campaign: AnnotationCampaign = AnnotationCampaignContextFilter.get_node_or_fail(
        info.context,
        pk=campaign_id,
    )
    return campaign.phases.get_viewable_or_fail(
        info.context.user,
        annotation_campaign_id=campaign.id,
        phase=phase_type.value,
    )


AnnotationPhaseByCampaignPhase = graphene.Field(
    AnnotationPhaseNode,
    campaign_id=graphene.ID(required=True),
    phase_type=AnnotationPhaseType(required=True),
    resolver=resolve_phase,
)
