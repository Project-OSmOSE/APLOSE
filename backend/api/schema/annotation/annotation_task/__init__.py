import graphene
from graphene import ID

from backend.api.models import (
    AnnotationFileRange,
    Spectrogram,
    AnnotationTask,
    AnnotationCampaign,
)
from backend.api.schema.enums import AnnotationPhaseType, AnnotationTaskStatus
from backend.utils.schema import NotFoundError, GraphQLResolve, GraphQLPermissions
from .resume_connection import ResumeConnectionField
from .task_node import (
    AnnotationTaskNode,
    AnnotationTaskFilter,
)


def _get_task(
    spectrogram_id: int,
    campaign_id: int,
    annotator_id: int,
    phase_type: AnnotationPhaseType,
) -> AnnotationTask:
    """Get annotation task"""
    try:
        return AnnotationTask.objects.get(
            annotator_id=annotator_id,
            annotation_phase__annotation_campaign_id=campaign_id,
            annotation_phase__phase=phase_type.value,
            spectrogram_id=spectrogram_id,
        )
    except AnnotationTask.DoesNotExist:
        return AnnotationTask(
            annotator_id=annotator_id,
            annotation_phase__annotation_campaign_id=campaign_id,
            annotation_phase__phase=phase_type.value,
            spectrogram_id=spectrogram_id,
            status=AnnotationTaskStatus.Created,
        )


class AnnotationTaskQuery(graphene.ObjectType):
    """Annotation task queries"""

    annotation_tasks_for_user = ResumeConnectionField(
        AnnotationTaskNode,
        campaign_id=ID(required=True),
        annotator_id=ID(required=True),
        phase_type=AnnotationPhaseType(required=True),
    )

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def resolve_annotation_tasks_for_user(
        self,
        info,
        campaign_id: int,
        annotator_id: int,
        phase_type: AnnotationPhaseType,
        **kwargs
    ):
        """List tasks for user in phase"""
        file_ranges = AnnotationFileRange.objects.filter(
            annotator_id=annotator_id,
            annotation_phase__annotation_campaign_id=campaign_id,
            annotation_phase__phase=phase_type.value,
        )
        spectrograms = Spectrogram.objects.none()
        for file_range in file_ranges:
            spectrograms = spectrograms.union(
                Spectrogram.objects.filter(
                    start__gte=file_range.from_datetime,
                    end__lte=file_range.to_datetime,
                )
            )

        return list(
            map(
                lambda spectrogram: _get_task(
                    annotator_id=annotator_id,
                    spectrogram_id=spectrogram.id,
                    campaign_id=campaign_id,
                    phase_type=phase_type,
                ),
                spectrograms,
            )
        )

    annotation_tasks_for_user_by_spectrogram_id = graphene.Field(
        AnnotationTaskNode,
        spectrogram_id=ID(required=True),
        campaign_id=ID(required=True),
        annotator_id=ID(required=True),
        phase_type=AnnotationPhaseType(required=True),
    )

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def resolve_annotation_tasks_for_user_by_spectrogram_id(
        self,
        info,
        spectrogram_id: int,
        campaign_id: int,
        annotator_id: int,
        phase_type: AnnotationPhaseType,
    ):
        """Get task for user and spectrogram in phase"""
        spectrogram = Spectrogram.objects.get(pk=spectrogram_id)
        has_access = False
        if info.context.user.is_staff or info.context.user.is_superuser:
            has_access = True
        if AnnotationCampaign.objects.get(pk=campaign_id).owner == info.context.user:
            has_access = True
        if AnnotationFileRange.objects.filter(
            annotator_id=annotator_id,
            annotation_phase__annotation_campaign_id=campaign_id,
            annotation_phase__phase=phase_type.value,
            from_datetime__lte=spectrogram.start,
            to_datetime__gte=spectrogram.end,
        ).exists():
            has_access = True

        if not has_access:
            raise NotFoundError
        return _get_task(
            annotator_id=annotator_id,
            spectrogram_id=spectrogram_id,
            campaign_id=campaign_id,
            phase_type=phase_type,
        )
