"""Viewset for annotation file range"""
from typing import Optional

from django.db.models import (
    QuerySet,
    Q,
    Exists,
    OuterRef,
    Count,
    Value,
    Subquery,
    Func,
    F,
)
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.request import Request
from rest_framework.response import Response

from backend.api.models import (
    AnnotationFileRange,
    AnnotationTask,
    Annotation,
    AnnotationPhase,
    Spectrogram,
)
from backend.api.serializers import AnnotationFileRangeSerializer
from backend.api.serializers.annotation.file_range import FileRangeSpectrogramSerializer
from backend.utils.filters import ModelFilter, get_boolean_query_param


class AnnotationFileRangeFilesFilter(filters.BaseFilterBackend):
    """Filter dataset files from file ranges"""

    @staticmethod
    def get_results_for_file_range(
        request: Request,
        view,
        file_range: AnnotationFileRange,
        user_annotations: Optional[bool],
    ):
        """Recover matching results"""
        user_id = request.user.id
        features = get_boolean_query_param(
            request, "annotations__acoustic_features__isnull"
        )
        annotations: QuerySet[Annotation] = ModelFilter().filter_queryset(
            request, file_range.annotations, view
        )
        if features is not None:
            annotations = annotations.filter(acoustic_features__isnull=features)

        if user_annotations is not None:
            spectrogram_filter = Q(spectrogram_id=OuterRef("id"))
            if file_range.annotation_phase.phase == AnnotationPhase.Type.ANNOTATION:
                spectrogram_filter = spectrogram_filter & Q(annotator_id=user_id)
            elif file_range.annotation_phase.phase == AnnotationPhase.Type.VERIFICATION:
                spectrogram_filter = spectrogram_filter & ~Q(annotator_id=user_id)
            if user_annotations:
                annotations = annotations.filter(spectrogram_filter)
            else:
                annotations = annotations.filter(~spectrogram_filter)

        return annotations

    def filter_queryset(
        self, request: Request, queryset: QuerySet[AnnotationFileRange], view
    ) -> QuerySet[Spectrogram]:
        """Get filtered spectrograms"""
        spectrograms = Spectrogram.objects.none()
        for file_range in queryset:
            spectrograms = spectrograms | self._filter_queryset_for_file_range(
                request, file_range, view
            )

        return spectrograms.order_by("start", "id")

    def _filter_queryset_for_file_range(
        self, request: Request, file_range: AnnotationFileRange, view
    ) -> QuerySet[Spectrogram]:
        """Get filtered spectrograms for a specific file_range"""
        files = Spectrogram.objects.filter_for_file_range(file_range)
        files: QuerySet[Spectrogram] = ModelFilter().filter_queryset(
            request, files, view
        )

        with_user_annotations = get_boolean_query_param(
            request, "with_user_annotations"
        )
        results = self.get_results_for_file_range(
            request,
            view,
            file_range,
            user_annotations=with_user_annotations
            if with_user_annotations is not False
            else True,
        )
        if with_user_annotations is not None:
            files = files.filter(
                Exists(results)
                if with_user_annotations is not False
                else ~Exists(results),
            )

        files = files.annotate(
            results_count=Subquery(
                self.get_results_for_file_range(
                    request,
                    view,
                    file_range,
                    user_annotations=True,
                )
                .annotate(count=Func(F("id"), function="count"))
                .values("count")
            ),
        )

        is_submitted = get_boolean_query_param(request, "is_submitted")
        if is_submitted is not None:
            is_submitted_filter = Exists(
                AnnotationTask.objects.filter(
                    spectrogram_id=OuterRef("id"),
                    status=AnnotationTask.Status.FINISHED,
                    annotator=request.user,
                )
            )
            if is_submitted:
                files = files.filter(is_submitted_filter)
            else:
                files = files.filter(~is_submitted_filter)

        return files.order_by("start", "id")


class AnnotationFilePagination(PageNumberPagination):
    """Custom pagination to allow the front to select the page size"""

    page_size_query_param = "page_size"

    def get_paginated_response(self, data, next_file: Optional[int] = None):
        try:
            count = self.page.paginator.count
        except AttributeError:
            return Response(data)
        response = {
            "count": count,
            "next": self.get_next_link(),
            "previous": self.get_previous_link(),
            "results": data,
        }
        if next_file:
            response["resume"] = next_file
        return Response(response)


class AnnotationFileRangeFilter(filters.BaseFilterBackend):
    """Filter comment access base on user"""

    def filter_queryset(
        self, request: Request, queryset: QuerySet[AnnotationFileRange], view
    ):
        if request.user.is_staff or request.user.is_superuser:
            return queryset
        # When testing with campaign owner which is not an annotators, all items are doubled
        # (don't understand why, the result query is correct when executed directly in SQL console)
        # The .distinct() is necessary to assure the items are not doubled
        return queryset.filter(
            Q(annotation_phase__annotation_campaign__owner=request.user)
            | (
                Q(annotation_phase__annotation_campaign__archive__isnull=True)
                & Q(annotation_phase__file_ranges__annotator__id=request.user.id)
            )
        ).distinct()


class AnnotationFileRangeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A simple ViewSet for annotation file range related actions
    """

    queryset = AnnotationFileRange.objects.select_related(
        "annotator",
        "annotator__aplose",
        "annotation_phase",
        "annotation_phase__annotation_campaign__dataset",
    )
    serializer_class = AnnotationFileRangeSerializer
    filter_backends = (ModelFilter, AnnotationFileRangeFilter)
    permission_classes = (permissions.IsAuthenticated,)
    pagination_class = AnnotationFilePagination

    def get_queryset(self):
        queryset: QuerySet[AnnotationFileRange] = super().get_queryset()
        for_current_user = get_boolean_query_param(self.request, "for_current_user")
        if self.action in ["list", "retrieve"]:
            if for_current_user:
                queryset = queryset.filter(annotator_id=self.request.user.id)
            queryset = queryset.annotate(
                finished_tasks_count=AnnotationFileRange.get_finished_task_count_query()
            )
        return queryset

    def can_user_post_data(self, request_data: list[dict]) -> bool:
        """Check permission to post data for user"""
        if self.request.user.is_staff or self.request.user.is_superuser:
            return True
        required_campaign_phases = AnnotationPhase.objects.filter(
            id__in=[data["annotation_phase"] for data in request_data],
        )
        required_owned_campaign_phases = required_campaign_phases.filter(
            annotation_campaign__owner=self.request.user
        )
        # Check if non-staff user is owner of all campaigns where changes are requested
        return (
            required_campaign_phases.count() == required_owned_campaign_phases.count()
        )

    @action(
        methods=["GET"],
        detail=False,
        url_path="phase/(?P<phase_id>[^/.]+)/files",
        url_name="phase-files",
    )
    def list_files(self, request, phase_id: int = None):
        """List files of an annotator within a campaign through its file ranges"""
        queryset: QuerySet[AnnotationFileRange] = self.filter_queryset(
            self.get_queryset()
        ).filter(
            annotator_id=self.request.user.id,
            annotation_phase_id=phase_id,
        )
        phase: AnnotationPhase = AnnotationPhase.objects.filter(id=phase_id).first()

        created_annotations_filter = Q(
            annotation_results__annotation_phase_id=phase_id,
            annotation_results__annotator_id=self.request.user.id,
        )
        validated_annotation_results_count = Value(0)
        if phase is not None:
            if phase.phase == AnnotationPhase.Type.VERIFICATION:
                annotation_results_count_filter = Q(
                    annotations__annotation_phase__phase=AnnotationPhase.Type.ANNOTATION,
                    annotations__annotation_phase__annotation_campaign_id=phase.annotation_campaign_id,
                ) & ~Q(annotations__annotator_id=self.request.user.id)
                validated_annotation_results_count = Count(
                    "annotation_results",
                    filter=(
                        (
                            annotation_results_count_filter
                            & Q(
                                annotations__validations__annotator_id=self.request.user.id,
                                annotations__validations__is_valid=True,
                            )
                        )
                        | created_annotations_filter
                    ),
                    distinct=True,
                )
        spectrograms: QuerySet[Spectrogram] = (
            AnnotationFileRangeFilesFilter()
            .filter_queryset(request, queryset, self)
            .annotate(
                is_submitted=Exists(
                    AnnotationTask.objects.filter(
                        spectrogram_id=OuterRef("pk"),
                        annotation_phase_id=phase_id,
                        annotator_id=self.request.user.id,
                        status=AnnotationTask.Status.FINISHED,
                    )
                ),
                validated_results_count=validated_annotation_results_count,
            )
        )
        next_file = spectrograms.filter(is_submitted=False).first()
        paginated_files = self.paginate_queryset(spectrograms)
        if paginated_files is not None:
            spectrograms = spectrograms.filter(
                id__in=[file.id for file in paginated_files]
            )
        serializer = FileRangeSpectrogramSerializer(spectrograms, many=True)
        return self.paginator.get_paginated_response(
            serializer.data, next_file=next_file.id if next_file is not None else None
        )

    @action(
        methods=["POST"],
        detail=False,
        url_path="campaign/(?P<campaign_id>[^/.]+)/phase/(?P<phase_type>[^/.]+)",
        url_name="phase",
    )
    def update_for_campaign(self, request, campaign_id: int, phase_type: str):
        """POST an array of annotation file ranges, handle both update and create"""
        phase = get_object_or_404(
            AnnotationPhase,
            phase=AnnotationPhase.Type.from_label(phase_type),
            annotation_campaign_id=campaign_id,
        )
        files = Spectrogram.objects.filter(
            analysis__annotation_campaigns__id=campaign_id
        )

        def get_from_to(from_index: int, to_index: int) -> (int, int):
            from_datetime = files[from_index].start
            to_datetime = files[to_index].end
            if from_datetime > to_datetime:
                from_datetime, to_datetime = to_datetime, from_datetime
            else:
                from_datetime, to_datetime = from_datetime, to_datetime
            return from_datetime, to_datetime

        data = [
            {
                **d,
                "annotation_phase": phase.id,
                "from_datetime": get_from_to(
                    d["first_file_index"], d["last_file_index"]
                )[0],
                "to_datetime": get_from_to(d["first_file_index"], d["last_file_index"])[
                    1
                ],
            }
            for d in request.data["data"]
        ]

        if not self.can_user_post_data(data):
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = AnnotationFileRangeSerializer(
            phase.annotation_file_ranges,
            data=data,
            context={
                "force": request.data["force"] if "force" in request.data else False
            },
            many=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            AnnotationFileRangeSerializer(
                phase.annotation_file_ranges,
                many=True,
            ).data,
            status=status.HTTP_200_OK,
        )
