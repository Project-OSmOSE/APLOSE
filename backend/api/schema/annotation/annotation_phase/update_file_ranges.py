import graphene
from django.db import transaction
from django.db.models import Q
from graphene_django.debug import DjangoDebug
from graphene_django.types import ErrorType
from graphql import GraphQLError

from backend.api.models import AnnotationFileRange
from backend.api.schema.enums import AnnotationPhaseType
from backend.utils.schema import GraphQLResolve, GraphQLPermissions
from .phase_context_filter import AnnotationPhaseContextFilter
from ..annotation_file_range.file_range_input import (
    AnnotationFileRangeInput,
    AnnotationFileRangeMutation,
)


def clean_file_ranges(ids: list[int]):
    """Clean connected ranges to limit the number of different items"""
    return_ids = []
    for range_id in ids:
        queryset = AnnotationFileRange.objects.filter(id=range_id)
        if not queryset.exists():
            continue
        item = queryset.first()
        connected_ranges = AnnotationFileRange.get_connected_ranges(item)
        if connected_ranges.exists():
            # update connected
            min_first_index = min(
                connected_ranges.order_by("first_file_index").first().first_file_index,
                item.first_file_index,
            )
            max_last_index = max(
                connected_ranges.order_by("-last_file_index").first().last_file_index,
                item.last_file_index,
            )
            instance = connected_ranges.order_by("id").first()
            duplicates = AnnotationFileRange.objects.filter(
                annotator_id=instance.annotator_id,
                annotation_phase_id=instance.annotation_phase_id,
                first_file_index=min_first_index,
                last_file_index=max_last_index,
            )
            if duplicates.exists():
                instance = duplicates.first()
            else:
                instance.first_file_index = min_first_index
                instance.last_file_index = max_last_index
                instance.save()
            return_ids.append(instance.id)
            connected_ranges.exclude(id=instance.id).delete()
    return AnnotationFileRange.objects.filter(id__in=return_ids)


class UpdateAnnotationPhaseFileRanges(graphene.Mutation):
    class Arguments:
        campaign_id = graphene.ID(required=True)
        phase_type = AnnotationPhaseType(required=True)
        file_ranges = graphene.List(AnnotationFileRangeInput, required=True)
        force = graphene.Boolean()

    errors = graphene.List(
        graphene.List(graphene.NonNull(ErrorType), required=True),
        required=True,
    )
    debug = graphene.Field(DjangoDebug, name="_debug")

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    @transaction.atomic
    def mutate(
        self,
        info,
        campaign_id: int,
        phase_type: AnnotationPhaseType,
        file_ranges: [AnnotationFileRangeInput],
        force: bool = False,
    ):
        phase = AnnotationPhaseContextFilter.get_edit_node_or_fail(
            info.context, annotation_campaign_id=campaign_id, phase=phase_type.value
        )

        new_instance_ids = []
        errors = []
        original_ranges_to_delete = phase.annotation_file_ranges.all()

        for file_range in file_ranges:
            mutation = AnnotationFileRangeMutation.mutate(
                root=None,
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
            if mutation.annotationFileRange:
                new_instance_ids.append(mutation.annotationFileRange.id)
        original_ranges_to_delete = original_ranges_to_delete.filter(
            ~Q(id__in=new_instance_ids)
        ).annotate(
            finished_tasks_count=AnnotationFileRange.get_finished_task_count_query()
        )
        if not force:
            # Check ranges does not contain finished tasks
            for file_range in original_ranges_to_delete:
                if file_range.finished_tasks_count > 0:
                    raise GraphQLError(
                        message="Cannot delete range with finished tasks.",
                    )

        original_ranges_to_delete.delete()

        clean_file_ranges(new_instance_ids)

        return UpdateAnnotationPhaseFileRanges(errors=errors)
