"""AnnotationCampaign update mutations"""
import graphene
from django import forms
from graphene_django.debug import DjangoDebug

from backend.api.models import AnnotationCampaign
from backend.api.schema.context_filters import AnnotationCampaignContextFilter
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

    debug = graphene.Field(DjangoDebug, name="_debug")

    class Meta:
        form_class = UpdateAnnotationCampaignForm
        context_filter = AnnotationCampaignContextFilter
