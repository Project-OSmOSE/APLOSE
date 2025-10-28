import csv
from io import StringIO

from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from backend.api.models import Annotation, AnnotationPhase, Spectrogram
from backend.api.schema.context_filters import (
    AnnotationPhaseContextFilter,
)
from backend.api.schema.context_filters.annotation import AnnotationContextFilter
from backend.api.serializers import AnnotationSerializer, AnnotationImportSerializer
from backend.utils.filters import ModelFilter
from backend.utils.schema import ForbiddenError, NotFoundError


class AnnotationViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Annotation.objects.all()
    serializer_class = AnnotationSerializer
    filter_backends = (ModelFilter,)
    permission_classes = (permissions.IsAuthenticated,)

    @action(
        methods=["POST"],
        detail=False,
        url_path="campaign/(?P<campaign_id>[^/.]+)/phase/(?P<phase_type>[^/.]+)/",
        url_name="phase-import",
    )
    @transaction.atomic()
    def import_for_phase(
        self,
        request: Request,
        campaign_id: int,
        phase_type: AnnotationPhase.Type,
    ):
        try:
            phase = AnnotationPhaseContextFilter.get_edit_node_or_fail(
                request, annotation_campaign_id=campaign_id, phase=phase_type
            )
        except ForbiddenError:
            return Response(status=status.HTTP_403_FORBIDDEN)
        except NotFoundError:
            return Response(status=status.HTTP_404_NOT_FOUND)

        reader = csv.DictReader(StringIO(request.data))
        serializer = AnnotationImportSerializer(
            data=[
                {
                    "id": row["id"],
                    "start_time": row["start_time"],
                    "end_time": row["end_time"],
                    "start_frequency": row["start_frequency"],
                    "end_frequency": row["end_frequency"],
                    "label": row["label"],
                    "confidence": row["confidence"],
                    "analysis": row["analysis"],
                    "detector_configuration": row["detector_configuration"],
                    "spectrogram": row["spectrogram"],
                }
                for row in reader
            ],
            many=True,
            context={
                "user": request.user,
                "phase": phase,
                # See AnnotationResultImportSerializer.validate_datetime & AnnotationResultImportSerializer.validate_frequency for force use
                # "force_datetime": get_boolean_query_param(
                #     self.request, "force_datetime"
                # ),
                # "force_max_frequency": get_boolean_query_param(
                #     self.request, "force_max_frequency"
                # ),
            },
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_200_OK)

    @action(
        methods=["POST"],
        detail=False,
        url_path="campaign/(?P<campaign_id>[^/.]+)/phase/(?P<phase_type>[^/.]+)/spectrogram/(?P<spectrogram_id>[^/.]+)",
        url_name="phase-spectrogram-post",
    )
    @transaction.atomic()
    def update_for_spectrogram(
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
        queryset = AnnotationContextFilter.get_edit_queryset(
            request, annotation_phase_id=phase.id, spectrogram_id=spectrogram_id
        )
        serializer = AnnotationSerializer(
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
