"""AnnotationCampaign update mutations"""

from django import forms
from django.db import transaction
from graphene import (
    Mutation,
    Boolean,
    List,
    String,
)

from backend.api.models import AnnotationCampaign
from backend.api.schema.context_filters import AnnotationCampaignContextFilter
from backend.utils.schema import (
    GraphQLResolve,
    GraphQLPermissions,
)
from backend.utils.schema import (
    PK,
)
from backend.utils.schema.types import AuthenticatedModelFormMutation


class UpdateAnnotationCampaignForm(forms.ModelForm):
    class Meta:
        model = AnnotationCampaign
        fields = (
            "label_set",
            "confidence_set",
            "labels_with_acoustic_features",
            "allow_point_annotation",
        )


class UpdateAnnotationCampaignMutation(AuthenticatedModelFormMutation):
    class Meta:
        form_class = UpdateAnnotationCampaignForm


# TODO: remove following after testing is OK
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
