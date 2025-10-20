from typing import Optional

from django.db.models import QuerySet, Q, Exists, OuterRef
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.request import Request

from backend.api.models import (
    AnnotationFileRange,
    Annotation,
    AnnotationPhase,
)
from backend.utils.schema import NotFoundError, ForbiddenError


class AnnotationContextFilter:
    """Filter Annotation from the context"""

    @classmethod
    def get_queryset(
        cls,
        context: Request,
        annotation_phase_id: Optional[int] = None,
        spectrogram_id: Optional[int] = None,
        queryset: QuerySet[Annotation] = Annotation.objects.all(),
    ) -> QuerySet[Annotation]:
        """Get queryset depending on the context"""
        if annotation_phase_id is not None:
            queryset = queryset.filter(annotation_phase_id=annotation_phase_id)
        if spectrogram_id is not None:
            queryset = queryset.filter(spectrogram_id=spectrogram_id)
        if context.user.is_staff or context.user.is_superuser:
            return queryset
        return queryset.objects.filter(
            Q(annotation_phase__annotation_campaign__owner_id=context.user.id)
            | (
                Exists(
                    AnnotationFileRange.objects.filter(
                        annotation_phase_id=OuterRef("annotation_phase_id"),
                        annotator_id=context.user.id,
                        from_datetime__lte=OuterRef("spectrogram__start"),
                        to_datetime__gte=OuterRef("spectrogram__end"),
                    )
                )
                & Q(
                    annotation_phase__annotation_campaign__archive__isnull=True,
                )
                & (
                    Q(
                        annotation_phase__phase=AnnotationPhase.Type.ANNOTATION,
                        annotator_id=context.user.id,
                    )
                    | (
                        Q(annotation_phase__phase=AnnotationPhase.Type.VERIFICATION)
                        & (
                            ~Q(annotator_id=context.user.id)
                            | Q(
                                annotator_id=context.user.id, is_update_of__isnull=False
                            )
                        )
                    )
                )
            )
        )

    @classmethod
    def get_edit_queryset(
        cls,
        context: Request,
        annotation_phase_id: Optional[int] = None,
        spectrogram_id: Optional[int] = None,
        queryset: QuerySet[Annotation] = Annotation.objects.all(),
    ) -> QuerySet[Annotation]:
        """Get queryset depending on the context"""
        return cls.get_queryset(
            context,
            annotation_phase_id,
            spectrogram_id,
            queryset=queryset.filter(annotator_id=context.user.id),
        )

    @classmethod
    def get_node_or_fail(cls, context: Request, pk: int) -> Annotation:
        """Get node or fail depending on the context"""
        try:
            return get_object_or_404(
                cls.get_queryset(context, queryset=Annotation.objects.filter(pk=pk)),
                pk=pk,
            )
        except Http404:
            raise NotFoundError()

    @classmethod
    def get_edit_node_or_fail(cls, context: Request, pk: int) -> Annotation:
        """Get node with edit rights or fail depending on the context"""
        annotation = cls.get_node_or_fail(context, pk)
        if annotation.annotator_id != context.user.id:
            raise ForbiddenError()

        return annotation
