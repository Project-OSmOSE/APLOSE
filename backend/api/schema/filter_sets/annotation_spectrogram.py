from typing import Optional, TypedDict

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


class FilterData(TypedDict):
    phase: Optional[AnnotationPhase.Type]
    annotation_campaign: Optional[AnnotationCampaign]
    annotator: Optional[User]

    annotation_tasks__status: Optional[AnnotationTask.Status]
    annotations__exists: Optional[bool]
    annotations__confidence: Optional[Confidence]
    annotations__label: Optional[Label]
    annotations__acoustic_features__exists: Optional[bool]
    annotations__detector: Optional[Detector]
    annotations__annotator: Optional[User]
    only_assigned: Optional[bool]


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

    def get_filter_data(self) -> FilterData:
        phase = self.data.get("phase")
        annotation_tasks__status = self.data.get("annotation_tasks__status")
        return {
            "phase": AnnotationPhase.Type(phase) if phase is not None else phase,
            "annotation_campaign": AnnotationCampaign.objects.filter(
                id=self.data.get("annotation_campaign")
            ).first(),
            "annotator": User.objects.filter(id=self.data.get("annotator")).first(),
            "annotation_tasks__status": AnnotationTask.Status(annotation_tasks__status)
            if annotation_tasks__status is not None
            else annotation_tasks__status,
            "annotations__exists": self.data.get("annotations__exists"),
            "annotations__acoustic_features__exists": self.data.get(
                "annotations__acoustic_features__exists"
            ),
            "annotations__confidence": Confidence.objects.filter(
                id=self.data.get("annotations__confidence")
            ).first(),
            "annotations__label": Label.objects.filter(
                id=self.data.get("annotations__label")
            ).first(),
            "annotations__detector": Detector.objects.filter(
                id=self.data.get("annotations__detector")
            ).first(),
            "annotations__annotator": User.objects.filter(
                id=self.data.get("annotations__annotator")
            ).first(),
            "only_assigned": self.data.get("only_assigned"),
        }

    def filter_queryset(self, queryset: QuerySet[Spectrogram]):
        queryset: QuerySet[Spectrogram] = super().filter_queryset(queryset)
        filter_data = self.get_filter_data()

        # Filter: only_assigned [bool]
        filter_only_assigned: bool = (
            filter_data["only_assigned"] is not False
            or filter_data["annotations__exists"] is not None
            or filter_data["annotation_tasks__status"] is not None
        )

        # => QuerySet[AnnotationFileRange] & QuerySet[Annotation]
        file_ranges: QuerySet[AnnotationFileRange] = AnnotationFileRange.objects.all()
        annotations: QuerySet[Annotation] = Annotation.objects.all()
        if filter_data["annotator"]:
            file_ranges = AnnotationFileRange.objects.filter_viewable_by(
                user=filter_data["annotator"]
            )
        if filter_data["annotation_campaign"]:
            file_ranges = file_ranges.filter(
                annotation_phase__annotation_campaign=filter_data["annotation_campaign"]
            )
            annotations = annotations.filter(
                annotation_phase__annotation_campaign=filter_data["annotation_campaign"]
            )
            queryset = queryset.filter(
                analysis__annotation_campaigns=filter_data["annotation_campaign"]
            )
        if filter_data["phase"]:
            file_ranges = file_ranges.filter(
                annotation_phase__phase=filter_data["phase"]
            )
            if filter_data["phase"] == AnnotationPhase.Type.ANNOTATION:
                annotations = annotations.filter(
                    annotation_phase__phase=filter_data["phase"]
                )
                if filter_data["annotator"]:
                    annotations = annotations.filter(annotator=filter_data["annotator"])
            elif filter_data["annotator"]:
                annotations = annotations.filter(
                    ~Q(
                        annotator=filter_data["annotator"],
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
        if filter_data["annotation_tasks__status"]:
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
            if (
                filter_data["annotation_tasks__status"]
                == AnnotationTask.Status.FINISHED
            ):
                queryset = queryset.filter(query)
            if filter_data["annotation_tasks__status"] == AnnotationTask.Status.CREATED:
                queryset = queryset.filter(~query)  # Created task may not exist at all

        if filter_data["annotations__exists"] is not None:
            if filter_data["annotations__exists"]:
                if filter_data["annotations__label"]:
                    annotations = annotations.filter(
                        label=filter_data["annotations__label"]
                    )
                if filter_data["annotations__confidence"]:
                    annotations = annotations.filter(
                        confidence=filter_data["annotations__confidence"]
                    )
                if filter_data["annotations__annotator"]:
                    annotations = annotations.filter(
                        annotator=filter_data["annotations__annotator"]
                    )
                if filter_data["annotations__detector"]:
                    annotations = annotations.filter(
                        detector_configuration__detector=filter_data[
                            "annotations__detector"
                        ]
                    )
                if filter_data["annotations__acoustic_features__exists"] is not None:
                    annotations = annotations.filter(
                        acoustic_features__isnull=not filter_data[
                            "annotations__acoustic_features__exists"
                        ]
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
