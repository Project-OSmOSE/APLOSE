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


class SubmitAnnotationTaskMutation(graphene.Mutation):
    class Input:
        campaign_id = graphene.ID(required=True)
        phase_type = AnnotationPhaseType(required=True)
        spectrogram_id = graphene.ID(required=True)
        started_at = graphene.DateTime(required=True)
        ended_at = graphene.DateTime(required=True)
        content = graphene.String(required=True)

    ok = Boolean(required=True)

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    @transaction.atomic
    def mutate(
        self,
        info,
        campaign_id: int,
        phase_type: AnnotationPhaseType,
        spectrogram_id: int,
        started_at: datetime,
        ended_at: datetime,
        content: str,
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

        session = Session.objects.create(
            start=started_at, end=ended_at, session_output=content
        )
        AnnotationTaskSession.objects.create(
            annotation_task=task,
            session=session,
        )

        return SubmitAnnotationTaskMutation(ok=True)
