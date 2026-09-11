import graphene
from django import forms
from django.core.validators import MaxValueValidator, MinValueValidator
from graphene_django.forms.mutation import DjangoModelFormMutation

from backend.api.models import AnnotationFileRange, AnnotationPhase
from ..nodes import AnnotationFileRangeNode


class AnnotationFileRangeInput(graphene.InputObjectType):

    id = graphene.ID()
    annotator_id = graphene.NonNull(graphene.ID)
    annotation_phase_id = graphene.NonNull(graphene.ID)

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
        # Add validators to avoir file indexes to get higher than actual spectrogram count

        try:
            phase: AnnotationPhase = AnnotationPhase.objects.get(
                pk=self.data["annotation_phase"]
            )
        except AnnotationPhase.DoesNotExist:
            return super().clean()

        max_count = phase.annotation_campaign.spectrograms.count() - 1
        self.fields["first_file_index"].validators.append(MaxValueValidator(max_count))
        self.fields["last_file_index"].validators.append(MaxValueValidator(max_count))
        self.fields["last_file_index"].validators.append(
            MinValueValidator(self.data["first_file_index"]),
        )
        return super()._clean_fields()


class AnnotationFileRangeMutation(DjangoModelFormMutation):
    file_range = graphene.Field(AnnotationFileRangeNode)

    class Meta:
        form_class = AnnotationFileRangeForm
