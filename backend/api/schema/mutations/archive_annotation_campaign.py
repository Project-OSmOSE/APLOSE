"""AnnotationCampaign update mutations"""

from django.db import transaction
from django.db.models import QuerySet
from graphene import (
    Mutation,
    Boolean,
    ID,
)

from backend.api.models import AnnotationCampaign
from backend.aplose.models import User
from backend.utils.schema import (
    GraphQLResolve,
    GraphQLPermissions,
    NotFoundError,
    ForbiddenError,
)


class ArchiveAnnotationCampaignMutation(
    Mutation
):  # pylint: disable=too-few-public-methods
    """Archive annotation campaign mutation"""

    class Arguments:
        # pylint: disable=too-few-public-methods, missing-class-docstring
        id = ID(required=True)

    ok = Boolean(required=True)

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    @transaction.atomic
    def mutate(self, info, id: int):  # pylint: disable=redefined-builtin
        """Archive annotation campaign at current date by request user"""
        campaign: QuerySet[
            AnnotationCampaign
        ] = AnnotationCampaign.objects.filter_user_access(info.context.user).filter(
            pk=id
        )
        if not campaign.exists():
            raise NotFoundError()
        campaign: AnnotationCampaign = campaign.first()

        user: User = info.context.user
        if not (user.is_staff or user.is_superuser or campaign.owner_id == user.id):
            raise ForbiddenError()
        campaign.do_archive(user)
        return ArchiveAnnotationCampaignMutation(ok=True)
