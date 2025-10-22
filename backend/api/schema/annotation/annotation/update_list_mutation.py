import graphene
from django.db import transaction
from django.shortcuts import get_object_or_404
from graphene_django.types import ErrorType

from backend.api.models import AnnotationPhase
from backend.api.schema.enums import AnnotationPhaseType
from backend.utils.schema import GraphQLResolve, GraphQLPermissions, ForbiddenError
from .annotation_context_filter import AnnotationContextFilter
from .annotation_input import AnnotationInput
from .mutation import AnnotationMutation


class UpdateAnnotationListMutation(graphene.Mutation):
    class Arguments:
        campaign_id = graphene.ID(required=True)
        phase_type = AnnotationPhaseType(required=True)
        spectrogram_id = graphene.ID(required=True)
        annotations = graphene.List(AnnotationMutation.Field, required=True)

    errors = graphene.List(
        graphene.List(graphene.NonNull(ErrorType), required=True),
        required=True,
    )

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    @transaction.atomic
    def mutate(
        self,
        info,
        campaign_id: int,
        phase_type: AnnotationPhaseType,
        spectrogram_id: int,
        annotations: [AnnotationInput],
    ):
        phase = get_object_or_404(
            AnnotationPhase, annotation_campaign_id=campaign_id, phase=phase_type.value
        )

        errors = []
        existing_annotations_id = AnnotationContextFilter.get_edit_queryset(
            info.context,
            annotation_phase_id=phase.id,
            spectrogram_id=spectrogram_id,
        ).values_list("id", flat=True)

        for annotation in annotations:
            input = {**annotation}
            if (
                annotation.id is not None
                and annotation.id not in existing_annotations_id
            ):
                raise ForbiddenError()

            mutation = AnnotationMutation()
            mutation.mutate(
                info=info,
                input=input,
            )
            errors.append(mutation.errors)

        return UpdateAnnotationListMutation(errors=errors)
