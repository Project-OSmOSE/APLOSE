import graphene
from django import forms
from django.core import validators

from backend.api.models import AnnotationFileRange, AnnotationPhase
from backend.utils.schema.types import AuthenticatedModelFormMutation


class AnnotationFileRangeInput(graphene.InputObjectType):

    id = graphene.ID()
    annotator_id = graphene.ID()

    first_file_index = graphene.Int(required=True)
    last_file_index = graphene.Int(required=True)


class AnnotationFileRangeForm(forms.ModelForm):
    class Meta:
        model = AnnotationFileRange
        fields = (
            "id",
            "annotator",
            "annotation_phase",
            "first_file_index",
            "last_file_index",
        )

    def _clean_fields(self):
        try:
            phase: AnnotationPhase = AnnotationPhase.objects.get(
                pk=self.data["annotation_phase"]
            )
        except AnnotationPhase.DoesNotExist:
            return super().clean()

        max_count = phase.annotation_campaign.spectrograms.count() - 1
        self.fields["first_file_index"].validators.append(
            validators.MaxValueValidator(max_count)
        )
        self.fields["last_file_index"].validators.append(
            validators.MaxValueValidator(max_count)
        )
        self.fields["last_file_index"].validators.append(
            validators.MinValueValidator(self.data["first_file_index"]),
        )
        return super()._clean_fields()


class AnnotationFileRangeMutation(AuthenticatedModelFormMutation):
    class Meta:
        form_class = AnnotationFileRangeForm
