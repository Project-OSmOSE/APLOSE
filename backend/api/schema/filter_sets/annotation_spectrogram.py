from django.db.models import QuerySet, Exists, OuterRef, Subquery
from django_filters import OrderingFilter, filters
from graphene_django import filter

from backend.api.models import (
    Spectrogram,
    AnnotationFileRange,
    AnnotationTask,
    Annotation,
    AnnotationPhase,
)
from backend.api.schema.enums import AnnotationPhaseType, AnnotationTaskStatus
from backend.utils.schema.filters import BaseFilterSet, IDFilter


class AnnotationSpectrogramFilterSet(BaseFilterSet):

    phase = filter.TypedFilter(AnnotationPhaseType, method="fake")
    annotation_campaign = IDFilter(method="fake")
    annotator = IDFilter(method="fake")

    annotation_tasks__status = filter.TypedFilter(AnnotationTaskStatus, method="fake")

    annotations__exists = filters.BooleanFilter(method="fake")
    annotations__confidence__label = filters.CharFilter(method="fake")
    annotations__label_name = filters.CharFilter(method="fake")
    annotations__acoustic_features__exists = filters.BooleanFilter(method="fake")
    annotations__detector = IDFilter(method="fake")
    annotations__annotator = IDFilter(method="fake")

    class Meta:
        model = Spectrogram
        fields = {
            "start": ["lte"],
            "end": ["gte"],
            "filename": ["icontains"],
        }

    order_by = OrderingFilter(fields=("start",))

    def fake(self, queryset, _1, _2):
        return queryset

    def filter_queryset(self, queryset: QuerySet[Spectrogram]):
        queryset = super().filter_queryset(queryset)

        queryset, file_ranges, tasks, annotations = self._get_querysets_for_filter(
            queryset
        )

        # Filter through existing file range
        queryset = queryset.filter(
            Exists(
                file_ranges.filter(
                    from_datetime__lte=OuterRef("start"),
                    to_datetime__gte=OuterRef("end"),
                )
            )
        )

        # Filter on task status
        status = self.data.get("annotation_tasks__status")
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

            detector = self.data.get("annotations__detector")
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

        return queryset.distinct()

    def _get_querysets_for_filter(
        self, queryset: QuerySet[Spectrogram]
    ) -> (
        QuerySet[Spectrogram],
        QuerySet[AnnotationFileRange],
        QuerySet[AnnotationTask],
        QuerySet[Annotation],
    ):

        spectrograms = queryset
        file_ranges = AnnotationFileRange.objects.all()
        tasks = AnnotationTask.objects.all()
        annotations = Annotation.objects.all()

        phase_type = self.data.get("phase")
        if phase_type:
            file_ranges = file_ranges.filter(annotation_phase__phase=phase_type)
            tasks = tasks.filter(annotation_phase__phase=phase_type)

        campaign_id = self.data.get("annotation_campaign")
        if campaign_id:
            file_ranges = file_ranges.filter(
                annotation_phase__annotation_campaign_id=campaign_id
            )
            tasks = tasks.filter(annotation_phase__annotation_campaign_id=campaign_id)
            annotations = annotations.filter(
                annotation_phase__annotation_campaign_id=campaign_id
            )
            spectrograms = spectrograms.filter(
                analysis__annotation_campaigns__id=campaign_id
            )

        if phase_type and campaign_id:
            if phase_type == AnnotationPhase.Type.ANNOTATION:
                annotations = annotations.filter(
                    annotation_phase__phase=phase_type,
                    annotation_phase__annotation_campaign_id=campaign_id,
                )

        annotator_id = self.data.get("annotator")
        if annotator_id:
            file_ranges = file_ranges.filter(annotator_id=annotator_id)
            tasks = tasks.filter(annotator_id=annotator_id)
            if phase_type == AnnotationPhase.Type.ANNOTATION:
                annotations = annotations.filter(annotator_id=annotator_id)

        return spectrograms, file_ranges, tasks, annotations
