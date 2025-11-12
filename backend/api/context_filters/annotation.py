"""Annotation context filter"""
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
        cls, context: Request, queryset=Annotation.objects.all(), **kwargs
    ) -> QuerySet[Annotation]:
        """Get queryset depending on the context"""
        queryset = queryset.filter(**kwargs)
        if context.user.is_staff or context.user.is_superuser:
            return queryset
        return queryset.filter(
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
    def get_edit_queryset(cls, context: Request, **kwargs) -> QuerySet[Annotation]:
        """Get queryset depending on the context"""
        return cls.get_queryset(context, annotator_id=context.user.id, **kwargs)

    @classmethod
    def get_node_or_fail(cls, context: Request, **kwargs) -> Annotation:
        """Get node or fail depending on the context"""
        try:
            return get_object_or_404(cls.get_queryset(context, **kwargs), **kwargs)
        except Http404 as not_found:
            raise NotFoundError() from not_found

    @classmethod
    def get_edit_node_or_fail(cls, context: Request, **kwargs) -> Annotation:
        """Get node with edit rights or fail depending on the context"""
        annotation = cls.get_node_or_fail(context, **kwargs)
        if annotation.annotator_id != context.user.id:
            raise ForbiddenError()

        return annotation
