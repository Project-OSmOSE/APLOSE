from django import forms
from graphene_django.forms.mutation import DjangoModelFormMutation

from backend.api.models import AnnotationCampaign
from backend.utils.schema import GraphQLResolve, GraphQLPermissions


class CreateAnnotationCampaignForm(forms.ModelForm):
    class Meta:
        model = AnnotationCampaign
        fields = (
            "name",
            "description",
            "instructions_url",
            "deadline",
            "allow_image_tuning",
            "allow_colormap_tuning",
            "colormap_default",
            "colormap_inverted_default",
            "dataset",
            "analysis",
        )


class CreateAnnotationCampaignMutation(DjangoModelFormMutation):
    
    class Meta:
        form_class = CreateAnnotationCampaignForm

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED).check_permission(
            info.context.user
        )
        return super().mutate_and_get_payload(root, info, **input)
