from django_extension.schema.errors import ForbiddenError
from graphene import Mutation, ID

from backend.api.models import AnnotationPhase, AnnotationCampaign
from backend.api.schema.enums import AnnotationPhaseType
from backend.utils.schema import GraphQLPermissions, GraphQLResolve


class CreateAnnotationPhase(Mutation):
    """Create annotation phase of type "Verification" mutation"""

    class Arguments:
        campaign_id = ID(required=True)
        type = AnnotationPhaseType(required=True)

    id = ID(required=True)

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def mutate(self, info, campaign_id: int, type: AnnotationPhaseType):
        """Archive annotation campaign at current date by request user"""
        campaign = AnnotationCampaign.objects.get_editable_or_fail(
            user=info.context.user,
            pk=campaign_id,
        )
        if campaign.phases.filter(phase=type.value).exists():
            raise ForbiddenError()
        phase: AnnotationPhase = AnnotationPhase.objects.create(
            phase=type.value,
            annotation_campaign_id=campaign_id,
            created_by_id=info.context.user.id,
        )
        return CreateAnnotationPhase(id=phase.pk)
