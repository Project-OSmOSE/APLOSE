from graphene import Mutation, Boolean, ObjectType

from backend.api.models import AnnotationPhase
from backend.api.schema.context_filters import (
    AnnotationPhaseContextFilter,
    AnnotationCampaignContextFilter,
)
from backend.api.schema.queries.annotation.annotation_phase import AnnotationPhaseType
from backend.utils.schema import (
    PK,
    GraphQLResolve,
    GraphQLPermissions,
    ForbiddenError,
)


class EndAnnotationPhaseMutation(Mutation):  # pylint: disable=too-few-public-methods
    """Archive annotation phase mutation"""

    class Arguments:
        # pylint: disable=too-few-public-methods, missing-class-docstring
        pk = PK(required=True)

    ok = Boolean(required=True)

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def mutate(self, info, pk: int):  # pylint: disable=redefined-builtin
        """Archive annotation campaign at current date by request user"""
        phase: AnnotationPhase = AnnotationPhaseContextFilter.get_edit_node_or_fail(
            info.context, pk
        )
        phase.end(info.context.user)
        return EndAnnotationPhaseMutation(ok=True)


class CreateAnnotationPhase(Mutation):  # pylint: disable=too-few-public-methods
    """Create annotation phase of type "Verification" mutation"""

    class Arguments:
        # pylint: disable=too-few-public-methods, missing-class-docstring
        campaign_pk = PK(required=True)
        type = AnnotationPhaseType(required=True)

    pk = PK(required=True)

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def mutate(
        self, info, campaign_pk: int, type: AnnotationPhaseType
    ):  # pylint: disable=redefined-builtin
        """Archive annotation campaign at current date by request user"""
        campaign = AnnotationCampaignContextFilter.get_edit_node_or_fail(
            info.context, campaign_pk
        )
        if campaign.phases.filter(phase=type.value).exists():
            raise ForbiddenError()
        phase: AnnotationPhase = AnnotationPhase.objects.create(
            phase=type.value,
            annotation_campaign_id=campaign_pk,
            created_by_id=info.context.user.id,
        )
        return CreateAnnotationPhase(pk=phase.pk)


class AnnotationPhaseMutation(ObjectType):  # pylint: disable=too-few-public-methods
    """AnnotationPhase mutations"""

    end_annotation_phase = EndAnnotationPhaseMutation.Field()

    create_annotation_phase = CreateAnnotationPhase.Field()
