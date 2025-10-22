from django.db.models import QuerySet, Exists, OuterRef, Subquery
from django_filters import FilterSet, OrderingFilter, filters
from graphene_django import filter

from backend.api.models import (
    Spectrogram,
    AnnotationFileRange,
    AnnotationTask,
    Annotation,
    AnnotationPhase,
)
from backend.api.schema.enums import AnnotationPhaseType, AnnotationTaskStatus


class AnnotationSpectrogramFilterSet(FilterSet):

    phase = filter.TypedFilter(AnnotationPhaseType, method="fake")
    annotation_campaign = filter.GlobalIDFilter(method="fake")
    annotator = filter.GlobalIDFilter(method="fake")

    annotation_tasks__status = filter.TypedFilter(AnnotationTaskStatus, method="fake")

    annotations__exists = filters.BooleanFilter(method="fake")
    annotations__confidence__label = filters.CharFilter(method="fake")
    annotations__label_name = filters.CharFilter(method="fake")
    annotations__acoustic_features__exists = filters.BooleanFilter(method="fake")
    annotations__detector = filter.GlobalIDFilter(method="fake")
    annotations__annotator = filter.GlobalIDFilter(method="fake")

    class Meta:
        model = Spectrogram
        fields = {
            "start": ["lte"],
            "end": ["gte"],
            "filename": ["icontains"],
        }

    order_by = OrderingFilter(fields=("start",))

    def fake(self):
        pass

    def filter_queryset(self, queryset: QuerySet[Spectrogram]):
        file_ranges = AnnotationFileRange.objects.all()
        tasks = AnnotationTask.objects.all()
        annotations = Annotation.objects.all()

        phase_id = self.data.get("phase")
        phase = None
        if phase_id:
            file_ranges = file_ranges.filter(annotation_phase__phase=phase_id)
            tasks = tasks.filter(annotation_phase__phase=phase_id)
            phase = AnnotationPhase.objects.get(id=phase_id)
            if phase.phase == AnnotationPhase.Type.ANNOTATION:
                annotations = annotations.filter(
                    annotation_phase_id=phase_id,
                )

        campaign = self.data.get("annotation_campaign")
        if campaign:
            file_ranges = file_ranges.filter(
                annotation_phase__annotation_campaign_id=campaign
            )
            tasks = tasks.filter(annotation_phase__annotation_campaign_id=campaign)
            annotations = annotations.filter(
                annotation_phase__annotation_campaign_id=campaign
            )

        annotator = self.data.get("annotator")
        if annotator:
            file_ranges = file_ranges.filter(annotator_id=annotator)
            tasks = tasks.filter(annotator_id=annotator)
            if phase and phase.phase == AnnotationPhase.Type.ANNOTATION:
                annotations = annotations.filter(annotator_id=annotator)

        # Filter through existing file range
        queryset = queryset.filter(
            Exists(
                file_ranges.filter(
                    from_datetime__lte=OuterRef("start_date"),
                    to_datetime__gte=OuterRef("end_date"),
                )
            )
        )

        # Filter on task status
        status = self.data.get("annotations__status")
        if status:
            q = Exists(
                tasks.filter(
                    status=AnnotationTask.Status.FINISHED, spectrogram_id=OuterRef("id")
                )
            )
            if status == AnnotationTask.Status.FINISHED:
                queryset = queryset.filter(q)
            if status == AnnotationTask.Status.CREATED:
                queryset = queryset.filter(~q)

        # Filter on annotations status
        if self.data.get("annotations__exists") is not None:

            label = self.data.get("annotations__label_name")
            if label:
                annotations = annotations.filter(label__name=label)

            confidence = self.data.get("annotations__confidence__label")
            if confidence:
                annotations = annotations.filter(confidence__label=confidence)

            features_exists = self.data.get("annotations__acoustic_features__exists")
            if features_exists:
                annotations = annotations.filter(
                    acoustic_features__isnull=not features_exists
                )

            detector = self.data.get("annotations__annotator")
            if detector:
                annotations = annotations.filter(
                    detector_configuration__detector_id=detector
                )

            a_annotator = self.data.get("annotations__annotator")
            if a_annotator:
                annotations = annotations.filter(annotator_id=a_annotator)

            q = Exists(
                Subquery(
                    annotations.filter(
                        spectrogram_id=OuterRef("id"),
                    )
                )
            )
            if self.data.get("annotations__exists"):
                queryset = queryset.filter(q)
            else:
                queryset = queryset.filter(~q)

        return super().filter_queryset(queryset)
