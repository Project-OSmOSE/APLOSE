from datetime import datetime

import graphene
from django.db import transaction
from django.http import Http404
from django.shortcuts import get_object_or_404
from graphene import Boolean

from backend.api.context_filters import AnnotationFileRangeContextFilter
from backend.api.models import Spectrogram, AnnotationTask, Session, AnnotationPhase
from backend.api.models.annotation.annotation_task import AnnotationTaskSession
from backend.api.schema.enums import AnnotationPhaseType
from backend.utils.schema import GraphQLResolve, GraphQLPermissions, NotFoundError
from .update_annotations import UpdateAnnotationsMutation
from .update_annotation_comments import UpdateAnnotationCommentsMutation


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

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
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
        annotation_mutation.mutate(
            None,
            info=info,
            input={
                "campaign_id": campaign_id,
                "phase_type": phase_type,
                "spectrogram_id": spectrogram_id,
                "list": annotations,
            },
        )

        comments_mutation = UpdateAnnotationCommentsMutation()
        comments_mutation.mutate(
            None,
            info=info,
            input={
                "campaign_id": campaign_id,
                "phase_type": phase_type,
                "spectrogram_id": spectrogram_id,
                "annotation_id": None,
                "list": task_comments,
            },
        )

        AnnotationFileRangeContextFilter.get_node_or_fail(
            info.context,
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
