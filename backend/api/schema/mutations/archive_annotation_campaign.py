"""AnnotationCampaign update mutations"""

from django.db import transaction
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions
from graphene import (
    Mutation,
    Boolean,
    ID,
)

from backend.api.models import AnnotationCampaign


class ArchiveAnnotationCampaignMutation(Mutation):
    """Archive annotation campaign mutation"""

    class Arguments:
        id = ID(required=True)

    ok = Boolean(required=True)

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    @transaction.atomic
    def mutate(self, info, id: int):
        """Archive annotation campaign at current date by request user"""
        campaign = AnnotationCampaign.objects.get_editable_or_fail(
            user=info.context.user, pk=id
        )
        campaign.do_archive(info.context.user)
        return ArchiveAnnotationCampaignMutation(ok=True)
