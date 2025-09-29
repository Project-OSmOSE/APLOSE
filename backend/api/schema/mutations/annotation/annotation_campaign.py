"""AnnotationCampaign mutations"""

from django.db import transaction
from django.db.models import QuerySet, Q
from graphene import (
    ObjectType,
    Mutation,
    Boolean,
    List,
    String,
)

from backend.api.models import AnnotationCampaign
from backend.api.schema.context_filters import AnnotationCampaignContextFilter
from backend.aplose.models import User
from backend.utils.schema import (
    GraphQLResolve,
    GraphQLPermissions,
    NotFoundError,
    ForbiddenError,
)
from backend.utils.schema import (
    PK,
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
        id = PK(required=True)

    ok = Boolean(required=True)

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    @transaction.atomic
    def mutate(self, info, id: int):  # pylint: disable=redefined-builtin
        """Archive annotation campaign at current date by request user"""
        campaign, user = get_campaign_and_user(info, id)
        campaign.do_archive(user)
        return ArchiveAnnotationCampaignMutation(ok=True)


class UpdateAnnotationCampaign(Mutation):
    """Update annotation campaign labels with features mutation"""

    class Arguments:
        # pylint: disable=too-few-public-methods, missing-class-docstring
        pk = PK(required=True)
        label_set_pk = PK()
        confidence_set_pk = PK()
        labels_with_acoustic_features = List(String)
        allow_point_annotation = Boolean()

    ok = Boolean(required=True)

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    @transaction.atomic
    def mutate(
        self,
        info,
        pk: int,
        labels_with_acoustic_features: [str] or None,
        label_set_pk: int or None,
        confidence_set_pk: int or None,
        allow_point_annotation: bool or None,
    ):  # pylint: disable=redefined-builtin
        """Update annotation campaign mutation"""
        campaign: AnnotationCampaign = (
            AnnotationCampaignContextFilter.get_edit_node_or_fail(info.context, pk)
        )

        if label_set_pk is not None:
            campaign.label_set_id = label_set_pk
        if labels_with_acoustic_features is not None:
            campaign.update_labels_with_acoustic_features(labels_with_acoustic_features)
        if confidence_set_pk is not None:
            if confidence_set_pk < 0:
                campaign.confidence_set_id = None
            else:
                campaign.confidence_set_id = confidence_set_pk
        if allow_point_annotation is not None:
            campaign.allow_point_annotation = allow_point_annotation
        campaign.save()

        return UpdateAnnotationCampaign(ok=True)


class UpdateAnnotationCampaignLabelsWithFeaturesMutation(Mutation):
    """Update annotation campaign labels with features mutation"""

    class Arguments:
        # pylint: disable=too-few-public-methods, missing-class-docstring
        id = PK(required=True)
        labels_with_acoustic_features = List(String, required=True)

    ok = Boolean(required=True)

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    @transaction.atomic
    def mutate(
        self, info, id: int, labels_with_acoustic_features: [str]
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

    update_annotation_campaign = UpdateAnnotationCampaign.Field()
    archive_annotation_campaign = ArchiveAnnotationCampaignMutation.Field()

    update_annotation_campaign_labels_with_features = (
        UpdateAnnotationCampaignLabelsWithFeaturesMutation.Field()
    )
