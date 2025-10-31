import csv
from datetime import datetime, timedelta
from io import StringIO
from typing import Optional

from django.db import transaction
from rest_framework import viewsets, permissions, status, serializers
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from backend.api.models import (
    Annotation,
    AnnotationPhase,
    Spectrogram,
    SpectrogramAnalysis,
    DetectorConfiguration,
    Detector,
    AnnotationCampaign,
    AnnotationTask,
)
from backend.api.context_filters import AnnotationPhaseContextFilter
from backend.api.serializers import AnnotationSerializer
from backend.utils.filters import ModelFilter, get_boolean_query_param
from backend.utils.schema import ForbiddenError, NotFoundError


def to_seconds(delta: timedelta) -> float:
    """Format seconds timedelta as float"""
    return delta.seconds + delta.microseconds / 1000000


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
            campaign: AnnotationCampaign = phase.annotation_campaign
        except ForbiddenError:
            return Response(status=status.HTTP_403_FORBIDDEN)
        except NotFoundError:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if phase.phase == AnnotationPhase.Type.VERIFICATION:
            return Response(
                "Import should always be made on annotation campaign",
                status=status.HTTP_400_BAD_REQUEST,
            )

        reader = csv.DictReader(StringIO(request.data["data"]))
        annotations = []
        for row in reader:
            confidence = None
            if row["confidence__label"] and row["confidence__level"] is not None:
                confidence = campaign.import_new_confidence(
                    label=row["confidence__label"],
                    level=row["confidence__level"],
                )

            analysis: Optional[SpectrogramAnalysis] = SpectrogramAnalysis.objects.get(
                pk=row["analysis"]
            )
            partial = {
                "start_frequency": row["start_frequency"] or None,
                "end_frequency": row["end_frequency"] or None,
                "label": campaign.import_new_label(row["label__name"]),
                "confidence": confidence,
                "annotation_phase": phase,
                "annotator": None,
                "analysis": analysis,
                "annotator_expertise_level": None,
                "is_update_of": None,
                "detector_configuration": DetectorConfiguration.objects.get_or_create(
                    configuration=row["detector_configuration__configuration"],
                    detector=Detector.objects.get_or_create(name=row["detector__name"])[
                        0
                    ],
                )[0],
            }

            spectrograms = Spectrogram.objects.filter_matches_time_range(
                start=datetime.fromisoformat(row["start_datetime"]),
                end=datetime.fromisoformat(row["end_datetime"]),
            ).filter(
                analysis__dataset_id=phase.annotation_campaign.dataset_id,
                analysis=analysis,
            )

            if not spectrograms.exists():
                if get_boolean_query_param(self.request, "force_datetime"):
                    continue
                raise serializers.ValidationError(
                    "This start and end datetime does not belong to any spectrogram of the dataset",
                    code="invalid",
                )

            for s in spectrograms:
                annotation = {**partial, "spectrogram": s}

                start: datetime = datetime.fromisoformat(row["start_datetime"])
                end: datetime = datetime.fromisoformat(row["end_datetime"])
                if start < s.start:
                    start_time = 0
                else:
                    start_time = to_seconds(start - s.start)
                if end > s.end:
                    end_time = to_seconds(s.end - s.start)
                else:
                    end_time = to_seconds(end - s.start)
                annotation["start_time"] = start_time
                annotation["end_time"] = end_time

                if (
                    start_time == 0
                    and to_seconds(s.end - s.start) == end_time
                    and (
                        annotation["start_frequency"] is None
                        or float(row["start_frequency"]) == 0.0
                    )
                    and (
                        annotation["end_frequency"] is None
                        or float(row["end_frequency"])
                        == analysis.fft.sampling_frequency / 2
                    )
                ):
                    annotation["type"] = Annotation.Type.WEAK
                    annotation["start_frequency"] = None
                    annotation["end_frequency"] = None
                    annotation["start_time"] = None
                    annotation["end_time"] = None
                elif row["start_datetime"] == row["end_datetime"] and (
                    row["start_frequency"] == row["end_frequency"]
                    or annotation["end_frequency"] is None
                ):
                    annotation["type"] = Annotation.Type.POINT
                    annotation["end_frequency"] = None
                    annotation["end_time"] = None
                else:
                    annotation["type"] = Annotation.Type.BOX

                if not Annotation.objects.filter(**annotation).exists():
                    annotations.append(
                        {
                            **annotation,
                            "spectrogram": annotation["spectrogram"].id,
                            "analysis": annotation["analysis"].id,
                            "detector_configuration": annotation[
                                "detector_configuration"
                            ].id,
                        }
                    )

        serializer = AnnotationSerializer(
            data=annotations,
            many=True,
            context={
                "request": request,
                "phase": phase,
                # See AnnotationResultImportSerializer.validate_datetime & AnnotationResultImportSerializer.validate_frequency for force use
                "force_max_frequency": get_boolean_query_param(
                    self.request, "force_max_frequency"
                ),
            },
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Update tasks to "Created" state
        AnnotationTask.objects.filter(
            annotation_phase__annotation_campaign_id=campaign_id,
            annotation_phase__phase=AnnotationPhase.Type.VERIFICATION,
            spectrogram_id__in=[a.spectrogram_id for a in serializer.instance],
        ).update(status=AnnotationTask.Status.CREATED)

        return Response(status=status.HTTP_201_CREATED)
