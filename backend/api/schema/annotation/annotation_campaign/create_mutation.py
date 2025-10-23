from django import forms

from backend.api.models import AnnotationCampaign
from backend.utils.schema.types import AuthenticatedModelFormMutation


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


class CreateAnnotationCampaignMutation(AuthenticatedModelFormMutation):
    class Meta:
        form_class = CreateAnnotationCampaignForm

    @classmethod
    def perform_mutate(cls, form, info):
        # Create the instance without saving it to the database
        instance = form.save(commit=False)
        # Set the owner to the authenticated user
        instance.owner = info.context.user
        # Save the instance to the database
        instance.save()
        # Save many-to-many relationships if any
        form.save_m2m()
        kwargs = {cls._meta.return_field_name: instance}
        return cls(errors=[], **kwargs)
