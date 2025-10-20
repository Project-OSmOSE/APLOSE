import graphene
from django import forms

from backend.api.models import AnnotationFileRange
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


class AnnotationFileRangeMutation(AuthenticatedModelFormMutation):
    class Meta:
        form_class = AnnotationFileRangeForm
