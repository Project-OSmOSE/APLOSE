from datetime import datetime

import graphene
from django.db import transaction
from django.http import Http404
from django.shortcuts import get_object_or_404
from graphene import Boolean
from graphene_django.types import ErrorType

from backend.api.models import (
    Spectrogram,
    AnnotationTask,
    Session,
    AnnotationPhase,
    AnnotationFileRange,
)
from backend.api.models.annotation.annotation_task import AnnotationTaskSession
from backend.api.schema.enums import AnnotationPhaseType
from backend.utils.schema import GraphQLResolve, GraphQLPermissions, NotFoundError
from .update_annotation_comments import UpdateAnnotationCommentsMutation
from .update_annotations import UpdateAnnotationsMutation


class SubmitAnnotationTaskMutation(graphene.Mutation):
    class Input:
        campaign_id = graphene.ID(required=True)
        phase_type = AnnotationPhaseType(required=True)
        spectrogram_id = graphene.ID(required=True)

        annotations = UpdateAnnotationsMutation.Input.list.type
        task_comments = UpdateAnnotationCommentsMutation.Input.list.type

        started_at = graphene.DateTime(required=True)
        ended_at = graphene.DateTime(required=True)

    ok = Boolean(required=True)

    annotation_errors = graphene.List(
        graphene.List(
            ErrorType, description="May contain more than one error for same field."
        )
    )
    task_comments_errors = graphene.List(
        graphene.List(
            ErrorType, description="May contain more than one error for same field."
        )
    )

    @transaction.atomic
    def mutate(
        self,
        info,
        campaign_id: int,
        phase_type: AnnotationPhaseType,
        spectrogram_id: int,
        annotations: [any],
        task_comments: [any],
        started_at: datetime,
        ended_at: datetime,
    ):
        """Update annotation task status to "FINISHED" and create a new session"""
        GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED).check_permission(
            info.context.user
        )
        try:
            spectrogram: Spectrogram = get_object_or_404(
                Spectrogram.objects.all(), pk=spectrogram_id
            )
            phase: AnnotationPhase = get_object_or_404(
                AnnotationPhase.objects.all(),
                annotation_campaign_id=campaign_id,
                phase=phase_type.value,
            )
        except Http404 as not_found:
            raise NotFoundError() from not_found

        annotation_mutation = UpdateAnnotationsMutation()
        annotation_payload = annotation_mutation.mutate_and_get_payload(
            None,
            info=info,
            campaign_id=campaign_id,
            phase_type=phase_type,
            spectrogram_id=spectrogram_id,
            list=annotations,
        )
        if annotation_payload.errors:
            return SubmitAnnotationTaskMutation(
                ok=False, annotation_errors=annotation_payload.errors
            )

        comments_mutation = UpdateAnnotationCommentsMutation()
        comments_payload = comments_mutation.mutate_and_get_payload(
            None,
            info=info,
            campaign_id=campaign_id,
            phase_type=phase_type,
            spectrogram_id=spectrogram_id,
            annotation_id=None,
            list=task_comments,
        )
        if comments_payload.errors:
            return SubmitAnnotationTaskMutation(
                ok=False, task_comments_errors=comments_payload.errors
            )

        AnnotationFileRange.objects.get_viewable_or_fail(
            user=info.context.user,
            annotation_phase=phase,
            from_datetime__lte=spectrogram.start,
            to_datetime__gte=spectrogram.end,
            annotator_id=info.context.user.id,
        )

        task: AnnotationTask = AnnotationTask.objects.get_or_create(
            annotation_phase=phase,
            annotator_id=info.context.user.id,
            spectrogram_id=spectrogram_id,
        )[0]
        task.status = AnnotationTask.Status.FINISHED
        task.save()

        a = [
            {
                **a,
                "acoustic_features": {
                    **a.acoustic_features,
                    "trend": a.acoustic_features.trend.value
                    if a.acoustic_features.trend is not None
                    else None,
                }
                if a.acoustic_features is not None
                else None,
            }
            for a in annotations
        ]
        session = Session.objects.create(
            start=started_at,
            end=ended_at,
            session_output={
                "results": a,
                "task_comments": task_comments,
            },
        )
        AnnotationTaskSession.objects.create(
            annotation_task=task,
            session=session,
        )

        return SubmitAnnotationTaskMutation(ok=True)
