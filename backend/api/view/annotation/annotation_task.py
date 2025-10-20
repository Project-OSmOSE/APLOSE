from django.db import transaction
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from backend.api.models import AnnotationPhase, AnnotationTask
from backend.api.serializers import SessionSerializer
from backend.utils.filters import ModelFilter


class AnnotationTaskViewSet(viewsets.ViewSet):

    queryset = AnnotationTask.objects.all()
    filter_backends = (ModelFilter,)
    permission_classes = (permissions.IsAuthenticated,)

    @action(
        methods=["POST"],
        detail=False,
        url_path="campaign/(?P<campaign_id>[^/.]+)/phase/(?P<phase_type>[^/.]+)/spectrogram/(?P<spectrogram_id>[^/.]+)",
        url_name="phase-spectrogram-post",
    )
    @transaction.atomic()
    def submit(
        self,
        request: Request,
        campaign_id: int,
        phase_type: AnnotationPhase.Type,
        spectrogram_id: int,
    ):
        # Get or create task
        task: AnnotationTask = AnnotationTask.objects.get_or_create(
            annotation_phase__annotation_campaign_id=campaign_id,
            annotation_phase__phase=phase_type,
            spectrogram_id=spectrogram_id,
            annotator_id=request.user.id,
        )

        # Create session
        serializer = SessionSerializer(
            data=request.data,
            many=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Update task
        task.status = AnnotationTask.Status.FINISHED
        task.sessions.objects.add(serializer.instance)

        return Response(status=status.HTTP_200_OK)
