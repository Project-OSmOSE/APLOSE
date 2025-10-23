from graphene import Mutation, ID

from backend.api.models import AnnotationPhase
from backend.api.schema.enums import AnnotationPhaseType
from backend.utils.schema import GraphQLPermissions, GraphQLResolve, ForbiddenError
from ..annotation_campaign import AnnotationCampaignContextFilter


class CreateAnnotationPhase(Mutation):  # pylint: disable=too-few-public-methods
    """Create annotation phase of type "Verification" mutation"""

    class Arguments:
        # pylint: disable=too-few-public-methods, missing-class-docstring
        campaign_id = ID(required=True)
        type = AnnotationPhaseType(required=True)

    id = ID(required=True)

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def mutate(
        self, info, campaign_id: int, type: AnnotationPhaseType
    ):  # pylint: disable=redefined-builtin
        """Archive annotation campaign at current date by request user"""
        campaign = AnnotationCampaignContextFilter.get_edit_node_or_fail(
            info.context, campaign_id
        )
        if campaign.phases.filter(phase=type.value).exists():
            raise ForbiddenError()
        phase: AnnotationPhase = AnnotationPhase.objects.create(
            phase=type.value,
            annotation_campaign_id=campaign_id,
            created_by_id=info.context.user.id,
        )
        return CreateAnnotationPhase(id=phase.pk)
