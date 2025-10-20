import graphene
from django.db import transaction
from django.shortcuts import get_object_or_404
from graphene_django.types import ErrorType

from backend.api.models import AnnotationPhase
from backend.utils.schema import GraphQLResolve, GraphQLPermissions
from ..annotation_file_range.file_range_input import (
    AnnotationFileRangeInput,
    AnnotationFileRangeMutation,
)
from ...annotation.annotation_phase.phase_node import AnnotationPhaseType


class UpdateAnnotationPhaseFileRanges(graphene.Mutation):
    class Arguments:
        campaign_id = graphene.ID(required=True)
        phase_type = AnnotationPhaseType(required=True)
        file_ranges = graphene.List(AnnotationFileRangeInput, required=True)

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
        file_ranges: [AnnotationFileRangeInput],
    ):
        phase = get_object_or_404(
            AnnotationPhase, annotation_campaign_id=campaign_id, phase=phase_type.value
        )

        errors = []

        for file_range in file_ranges:
            mutation = AnnotationFileRangeMutation()
            mutation.mutate(
                info=info,
                input={
                    "id": file_range.id,
                    "annotator": file_range.annotator_id,
                    "annotation_phase": phase.id,
                    "first_file_index": file_range.first_file_index,
                    "last_file_index": file_range.last_file_index,
                },
            )
            errors.append(mutation.errors)

        return UpdateAnnotationPhaseFileRanges(errors=errors)
