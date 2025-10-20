from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from backend.api.models import AnnotationPhase, Spectrogram, AnnotationComment
from backend.api.schema.annotation.annotation_comment.comment_context_filter import (
    AnnotationCommentContextFilter,
)
from backend.api.serializers.annotation.comment import AnnotationCommentSerializer
from backend.utils.filters import ModelFilter


class AnnotationCommentViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = AnnotationComment.objects.all()
    serializer_class = AnnotationCommentSerializer
    filter_backends = (ModelFilter,)
    permission_classes = (permissions.IsAuthenticated,)

    @action(
        methods=["POST"],
        detail=False,
        url_path="campaign/(?P<campaign_id>[^/.]+)/phase/(?P<phase_type>[^/.]+)/spectrogram/(?P<spectrogram_id>[^/.]+)",
        url_name="phase-spectrogram-post",
    )
    @transaction.atomic()
    def update_task_comments_for_spectrogram(
        self,
        request: Request,
        campaign_id: int,
        phase_type: AnnotationPhase.Type,
        spectrogram_id: int,
    ):
        phase = get_object_or_404(
            AnnotationPhase, annotation_campaign_id=campaign_id, phase=phase_type
        )
        spectrogram = get_object_or_404(Spectrogram, id=spectrogram_id)
        queryset = AnnotationCommentContextFilter.get_edit_queryset(
            request, annotation_phase_id=phase.id, spectrogram_id=spectrogram_id
        ).filter(
            annotation__isnull=True  # Get only task comments
        )
        serializer = AnnotationCommentSerializer(
            queryset,
            data=request.data,
            many=True,
            context={
                "user": request.user,
                "phase": phase,
                "spectrogram": spectrogram,
            },
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_200_OK)
