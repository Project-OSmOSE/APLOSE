from datetime import datetime

from django.db import transaction
from django.http import Http404
from django.shortcuts import get_object_or_404
import graphene
from graphene import Boolean

from backend.api.models import Spectrogram, AnnotationTask, Session
from backend.api.models.annotation.annotation_task import AnnotationTaskSession
from backend.api.schema.context_filters import AnnotationFileRangeContextFilter
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
    ):  # pylint: disable=redefined-builtin
        """Update annotation task status to "FINISHED" and create a new session"""
        try:
            spectrogram: Spectrogram = get_object_or_404(
                Spectrogram.objects.all(), pk=spectrogram_id
            )
        except Http404:
            raise NotFoundError()
        file_range = AnnotationFileRangeContextFilter.get_node_or_fail(
            info.context,
            annotation_phase__annotation_campaign_id=campaign_id,
            annotation_phase__phase=phase_type.value,
            from_datetime__lte=spectrogram.start,
            to_datetime__gte=spectrogram.end,
            annotator_id=info.context.user.id,
        )

        task: AnnotationTask = AnnotationTask.objects.get_or_create(
            annotation_phase__annotation_campaign_id=campaign_id,
            annotation_phase__phase=phase_type.value,
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
