"""AnnotationCampaign update mutations"""
from django import forms
from django_extension.schema.mutations import ExtendedModelFormMutation
from django_extension.schema.permissions import GraphQLPermissions

from backend.api.models import AnnotationCampaign


class UpdateAnnotationCampaignForm(forms.ModelForm):
    class Meta:
        model = AnnotationCampaign
        fields = (
            "label_set",
            "confidence_set",
            "labels_with_acoustic_features",
            "allow_point_annotation",
        )


class UpdateAnnotationCampaignMutation(ExtendedModelFormMutation):
    class Meta:
        model = AnnotationCampaign
        form_class = UpdateAnnotationCampaignForm
        permission = GraphQLPermissions.AUTHENTICATED
