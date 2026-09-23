import graphene
from django import forms
from django.core.validators import MaxValueValidator, MinValueValidator
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions
from graphene_django.forms.mutation import DjangoModelFormMutation
from graphene_django.types import ErrorType

from backend.api.models import AnnotationFileRange, AnnotationPhase, AnnotationTask


class AnnotationFileRangeInput(graphene.InputObjectType):
    """Input for annotation file range"""

    id = graphene.ID()
    annotator_id = graphene.NonNull(graphene.ID)
    annotation_phase_id = graphene.NonNull(graphene.ID)

    first_file_index = graphene.Int(required=True)
    last_file_index = graphene.Int(required=True)


class AnnotationFileRangeUpdateForm(forms.ModelForm):
    """Form for annotation file range"""

    class Meta:
        model = AnnotationFileRange
        fields = (
            "id",
            "first_file_index",
            "last_file_index",
        )

    def _set_index_validators(self, phase: AnnotationPhase):
        # Add validators to avoir file indexes to get higher than actual spectrogram count
        max_count = phase.annotation_campaign.spectrograms.count() - 1
        self.fields["first_file_index"].validators.append(MaxValueValidator(max_count))
        self.fields["last_file_index"].validators.append(MaxValueValidator(max_count))
        self.fields["last_file_index"].validators.append(
            MinValueValidator(self.data["first_file_index"]),
        )

    def _clean_fields(self):
        if self.instance.annotation_phase_id:
            phase = self.instance.annotation_phase
        else:
            phase = AnnotationPhase.objects.get(pk=self.data["annotation_phase"])
        self._set_index_validators(phase)
        return super()._clean_fields()


class AnnotationFileRangeCreateForm(AnnotationFileRangeUpdateForm):
    """Form for annotation file range"""

    class Meta:
        model = AnnotationFileRange
        fields = (
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
        self._set_index_validators(phase)

        return super()._clean_fields()


class AnnotationFileRangeCreateMutation(DjangoModelFormMutation):
    """Create/Update annotation file range"""

    class Meta:
        form_class = AnnotationFileRangeCreateForm

    @classmethod
    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def mutate_and_get_payload(cls, root, info, **input):
        AnnotationPhase.objects.get_editable_or_fail(
            user=info.context.user,
            id=input["annotation_phase"],
        )
        return super().mutate_and_get_payload(root, info, **input)


class AnnotationFileRangeUpdateMutation(DjangoModelFormMutation):
    """Create/Update annotation file range"""

    class Meta:
        form_class = AnnotationFileRangeUpdateForm

    @classmethod
    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def mutate_and_get_payload(cls, root, info, **input):
        AnnotationFileRange.objects.get_editable_or_fail(
            user=info.context.user, pk=input["id"]
        )
        form_kwargs = cls.get_form_kwargs(root, info, **input)
        form = cls._meta.form_class(**form_kwargs)

        form.is_valid()

        if form.errors:
            return cls(errors=ErrorType.from_errors(form.errors))
        # Build the instance without persisting yet, so we control save()
        instance = form.save(commit=False)

        # Pass force through to your custom save() method
        instance.save(force=True)

        # If the form has many-to-many fields, save them too
        if hasattr(form, "save_m2m"):
            form.save_m2m()

        # noinspection PyArgumentList
        return cls(errors=[], **{cls._meta.return_field_name: instance})


class AnnotationFileRangeDeleteMutation(graphene.Mutation):
    """Delete annotation file range"""

    class Arguments:
        id = graphene.ID(required=True)

    ok = graphene.Boolean(required=True)
    error = graphene.Field(ErrorType)

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def mutate(
        self,
        info,
        id: int,
    ):
        file_range = AnnotationFileRange.objects.get_editable_or_fail(
            user=info.context.user,
            id=id,
        )
        try:
            file_range.delete(force=True)
        except AnnotationTask.CannotDeleteFinished as e:
            # noinspection PyArgumentList
            return AnnotationFileRangeDeleteMutation(ok=False, error=e.gql_type())

        # noinspection PyArgumentList
        return AnnotationFileRangeDeleteMutation(ok=True)
