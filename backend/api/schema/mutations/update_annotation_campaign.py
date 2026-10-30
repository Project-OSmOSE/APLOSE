"""AnnotationCampaign update mutations"""
from typing import Any

import graphene
from django import forms
from django_extension.schema.mutations import ExtendedModelFormMutation, ListSerializerMutation
from django_extension.schema.permissions import GraphQLPermissions
from django_extension.serializers import ListSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from backend.api.models import AnnotationCampaign
from backend.api.models.annotation.annotation_campaign import AnnotationCampaignLabel
from backend.api.schema.nodes import label_set


class UpdateAnnotationCampaignForm(forms.ModelForm):
    class Meta:
        model = AnnotationCampaign
        fields = (
            "confidence_set",
            "allow_point_annotation",
        )


class UpdateAnnotationCampaignMutation(ExtendedModelFormMutation):
    class Meta:
        model = AnnotationCampaign
        form_class = UpdateAnnotationCampaignForm
        permission = GraphQLPermissions.AUTHENTICATED

    @classmethod
    def mutate_and_get_payload(cls, root, info, **kwargs):
        AnnotationCampaign.objects.get_editable_or_fail(
            user=info.context.user,
            pk=kwargs.get('id'),
        )
        return super().mutate_and_get_payload(root, info, **kwargs)


### Campaign <> Label

class UpdateAnnotationCampaignLabelForm(forms.ModelForm):
    class Meta:
        model = AnnotationCampaignLabel
        fields = (
            "id",
            "enable_acoustic_features",
        )

class AnnotationCampaignLabelAcousticFeaturesMutation(ExtendedModelFormMutation):
    class Meta:
        model = AnnotationCampaignLabel
        form_class = UpdateAnnotationCampaignLabelForm
        permission = GraphQLPermissions.AUTHENTICATED

    @classmethod
    def mutate_and_get_payload(cls, root, info, **kwargs):
        AnnotationCampaign.objects.get_editable_or_fail(
            user=info.context.user,
            annotationcampaignlabel__pk=kwargs.get('id'),
        )
        return super().mutate_and_get_payload(root, info, **kwargs)


class FixedListSerializer(ListSerializer):

    def run_child_validation(self, data: Any) -> Any:
        self.child.instance = self.instance.filter(pk=data.get('id', None)).first()
        self.child.initial_data = data
        return super().run_child_validation(data)


class AnnotationCampaignLabelSerializer(serializers.ModelSerializer):
    class Meta:
        list_serializer_class = FixedListSerializer
        model = AnnotationCampaignLabel
        fields = "__all__"


class AnnotationCampaignLabelListMutation(ListSerializerMutation):

    class Input:
        campaign_id = graphene.ID(required=True)

    class Meta:
        serializer_class = AnnotationCampaignLabelSerializer

    @classmethod
    def get_serializer_queryset(cls, root, info, **kwargs):
        campaign: AnnotationCampaign = AnnotationCampaign.objects.get_editable_or_fail(
            user=info.context.user,
            pk=kwargs.get('campaign_id'),
        )
        return campaign.annotationcampaignlabel_set.all()

