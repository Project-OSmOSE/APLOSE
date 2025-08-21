"""AnnotationCampaign mutations"""

from django.db import transaction
from django.db.models import QuerySet, Q
from graphene import (
    ObjectType,
    Mutation,
    ID,
    Boolean,
    List,
    String,
)

from backend.api.models import AnnotationCampaign
from backend.aplose.models import User
from backend.utils.schema import (
    GraphQLResolve,
    GraphQLPermissions,
    NotFoundError,
    ForbiddenError,
)


# pylint: disable=redefined-builtin
def get_campaign_and_user(info, id) -> (AnnotationCampaign, User):
    """Check user is authorized and provide requested campaign"""
    campaign: QuerySet[
        AnnotationCampaign
    ] = AnnotationCampaign.objects.filter_user_access(info.context.user).filter(pk=id)
    if not campaign.exists():
        raise NotFoundError()
    campaign: AnnotationCampaign = campaign.first()

    user: User = info.context.user
    if not (user.is_staff or user.is_superuser or campaign.owner_id == user.id):
        raise ForbiddenError()

    return campaign, user


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
    def mutate(self, info, id):  # pylint: disable=redefined-builtin
        """Archive annotation campaign at current date by request user"""
        campaign, user = get_campaign_and_user(info, id)
        campaign.do_archive(user)
        return ArchiveAnnotationCampaignMutation(ok=True)


class UpdateAnnotationCampaignLabelsWithFeaturesMutation(Mutation):
    """Update annotation campaign labels with features mutation"""

    class Arguments:
        # pylint: disable=too-few-public-methods, missing-class-docstring
        id = ID(required=True)
        labels_with_acoustic_features = List(String, required=True)

    ok = Boolean(required=True)

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    @transaction.atomic
    def mutate(
        self, info, id, labels_with_acoustic_features: [str]
    ):  # pylint: disable=redefined-builtin
        """Update annotation campaign labels with features mutation"""
        campaign: AnnotationCampaign
        campaign, _ = get_campaign_and_user(info, id)

        removed_labels = campaign.labels_with_acoustic_features.filter(
            ~Q(name__in=labels_with_acoustic_features)
        )
        for label in removed_labels:
            campaign.labels_with_acoustic_features.remove(label)

        added_labels = campaign.label_set.labels.filter(
            name__in=labels_with_acoustic_features
        )
        for label in added_labels:
            if not campaign.labels_with_acoustic_features.filter(
                name=label.name
            ).exists():
                campaign.labels_with_acoustic_features.add(label)
        return ArchiveAnnotationCampaignMutation(ok=True)


class AnnotationCampaignMutation(ObjectType):  # pylint: disable=too-few-public-methods
    """AnnotationCampaign mutations"""

    archive_annotation_campaign = ArchiveAnnotationCampaignMutation.Field()
    update_annotation_campaign_labels_with_features = (
        UpdateAnnotationCampaignLabelsWithFeaturesMutation.Field()
    )
