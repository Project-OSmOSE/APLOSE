from typing import Optional

from django.db.models import QuerySet, OuterRef, Q, Exists
from django_extension.filters import ExtendedFilterSet, IDFilter
from django_filters import OrderingFilter, filters
from graphene_django import filter

from backend.api.models import (
    Spectrogram,
    AnnotationFileRange,
    AnnotationTask,
    Annotation,
    AnnotationCampaign,
    Confidence,
    Label,
    Detector,
    AnnotationPhase,
)
from backend.api.schema.enums import AnnotationPhaseType, AnnotationTaskStatus
from backend.aplose.models import User


class AnnotationSpectrogramFilterSet(ExtendedFilterSet):

    phase = filter.TypedFilter(AnnotationPhaseType, method="fake")
    annotation_campaign = IDFilter(method="fake")
    annotator = IDFilter(method="fake")

    annotation_tasks__status = filter.TypedFilter(AnnotationTaskStatus, method="fake")

    annotations__exists = filters.BooleanFilter(method="fake")
    annotations__confidence = IDFilter(method="fake")
    annotations__label = IDFilter(method="fake")
    annotations__acoustic_features__exists = filters.BooleanFilter(method="fake")
    annotations__detector = IDFilter(method="fake")
    annotations__annotator = IDFilter(method="fake")

    only_assigned = filters.BooleanFilter(method="fake")

    class Meta:
        model = Spectrogram
        fields = {
            "start": ["lte"],
            "end": ["gte"],
            "filename": ["icontains"],
        }

    order_by = OrderingFilter(fields=(("start", "start"),))

    def fake(self, queryset, _1, _2):
        return queryset

    def filter_queryset(self, queryset: QuerySet[Spectrogram]):
        queryset: QuerySet[Spectrogram] = super().filter_queryset(queryset)

        # Filter: phase [AnnotationPhase.Type]
        filter_phase: Optional[AnnotationPhase.Type] = self.data.get("phase")
        # Filter: annotation_campaign [ID]
        filter_annotation_campaign: Optional[
            AnnotationCampaign
        ] = AnnotationCampaign.objects.filter(
            id=self.data.get("annotation_campaign")
        ).first()
        # Filter: annotator [ID]
        filter_annotator: Optional[User] = User.objects.filter(
            id=self.data.get("annotator")
        ).first()

        # Filter: annotation_tasks__status [AnnotationTaskStatus]
        filter_annotation_tasks__status: Optional[AnnotationTaskStatus] = self.data.get(
            "annotation_tasks__status"
        )

        # Filter: annotations__exists [bool]
        filter_annotations__exists: Optional[bool] = self.data.get(
            "annotations__exists"
        )
        # Filter: annotations__confidence [ID]
        filter_annotations__confidence: Optional[
            Confidence
        ] = Confidence.objects.filter(
            pk=self.data.get("annotations__confidence")
        ).first()
        # Filter: annotations__label [ID]
        filter_annotations__label: Optional[Label] = Label.objects.filter(
            pk=self.data.get("annotations__label")
        ).first()
        # Filter: annotations__acoustic_features__exists [bool]
        filter_annotations__acoustic_features__exists: Optional[bool] = self.data.get(
            "annotations__acoustic_features__exists"
        )
        # Filter: annotations__detector [ID]
        filter_annotations__detector: Optional[Detector] = Detector.objects.filter(
            pk=self.data.get("annotations__detector")
        ).first()
        # Filter: annotations__annotator [ID]
        filter_annotations__annotator: Optional[User] = User.objects.filter(
            pk=self.data.get("annotations__annotator")
        ).first()

        # Filter: only_assigned [bool]
        filter_only_assigned: bool = (
            self.data.get("only_assigned", False) is not False
            or filter_annotations__exists is not None
            or filter_annotation_tasks__status is not None
        )

        # => QuerySet[AnnotationFileRange] & QuerySet[Annotation]
        file_ranges: QuerySet[AnnotationFileRange] = AnnotationFileRange.objects.all()
        annotations: QuerySet[Annotation] = Annotation.objects.all()
        if filter_annotator:
            file_ranges = AnnotationFileRange.objects.filter_viewable_by(
                user=filter_annotator
            )
        if filter_annotation_campaign:
            file_ranges = file_ranges.filter(
                annotation_phase__annotation_campaign=filter_annotation_campaign
            )
            annotations = annotations.filter(
                annotation_phase__annotation_campaign=filter_annotation_campaign
            )
            queryset = queryset.filter(
                analysis__annotation_campaigns=filter_annotation_campaign
            )
        if filter_phase:
            file_ranges = file_ranges.filter(annotation_phase__phase=filter_phase)
            if filter_phase == AnnotationPhase.Type.ANNOTATION:
                annotations = annotations.filter(annotation_phase__phase=filter_phase)
                if filter_annotator:
                    annotations = annotations.filter(annotator=filter_annotator)
            elif filter_annotator:
                annotations = annotations.filter(
                    ~Q(
                        annotator=filter_annotator,
                        annotation_phase__phase=AnnotationPhase.Type.ANNOTATION,
                    )
                )

        # Filter assigned spectrograms
        if filter_only_assigned:
            queryset = queryset.filter(
                Exists(
                    file_ranges.filter(
                        from_datetime__lte=OuterRef("start"),
                        to_datetime__gte=OuterRef("end"),
                    )
                )
            )

        # Filter on task status
        if filter_annotation_tasks__status:
            tasks_ids = []
            for fr in file_ranges:
                tasks_ids += fr.tasks.values_list("id", flat=True)
            tasks: QuerySet[AnnotationTask] = AnnotationTask.objects.filter(
                id__in=tasks_ids
            )
            finished_task_spectrogram_ids = tasks.filter(
                status=AnnotationTask.Status.FINISHED
            ).values_list("spectrogram_id", flat=True)
            query = Q(id__in=finished_task_spectrogram_ids)
            if filter_annotation_tasks__status == AnnotationTask.Status.FINISHED:
                queryset = queryset.filter(query)
            if filter_annotation_tasks__status == AnnotationTask.Status.CREATED:
                queryset = queryset.filter(~query)  # Created task may not exist at all

        if filter_annotations__exists is not None:
            if filter_annotations__exists:
                if filter_annotations__label:
                    annotations = annotations.filter(label=filter_annotations__label)
                if filter_annotations__confidence:
                    annotations = annotations.filter(
                        confidence=filter_annotations__confidence
                    )
                if filter_annotations__annotator:
                    annotations = annotations.filter(
                        annotator=filter_annotations__annotator
                    )
                if filter_annotations__detector:
                    annotations = annotations.filter(
                        detector_configuration__detector=filter_annotations__detector
                    )
                if filter_annotations__acoustic_features__exists is not None:
                    annotations = annotations.filter(
                        acoustic_features__isnull=not filter_annotations__acoustic_features__exists
                    )

                annotations_spectrogram_ids = annotations.values_list(
                    "spectrogram_id", flat=True
                ).distinct()
                queryset = queryset.filter(id__in=annotations_spectrogram_ids)
            else:
                queryset = queryset.filter(
                    ~Q(id__in=annotations.values_list("spectrogram_id", flat=True))
                )

        return queryset.distinct()
