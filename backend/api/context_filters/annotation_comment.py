from django.db.models import QuerySet, Q, Exists, OuterRef
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.request import Request

from backend.api.models import (
    AnnotationFileRange,
    AnnotationComment,
)
from backend.utils.schema import NotFoundError, ForbiddenError


class AnnotationCommentContextFilter:
    """Filter Annotation comment from the context"""

    @classmethod
    def get_queryset(
        cls, context: Request, queryset=AnnotationComment.objects.all(), **kwargs
    ) -> QuerySet[AnnotationComment]:
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
                    author_id=context.user.id,
                )
            )
        )

    @classmethod
    def get_edit_queryset(
        cls, context: Request, **kwargs
    ) -> QuerySet[AnnotationComment]:
        """Get queryset depending on the context"""
        return cls.get_queryset(context, **kwargs)

    @classmethod
    def get_node_or_fail(cls, context: Request, **kwargs) -> AnnotationComment:
        """Get node or fail depending on the context"""
        try:
            return get_object_or_404(cls.get_queryset(context, **kwargs), **kwargs)
        except Http404:
            raise NotFoundError()

    @classmethod
    def get_edit_node_or_fail(cls, context: Request, **kwargs) -> AnnotationComment:
        """Get node with edit rights or fail depending on the context"""
        comment = cls.get_node_or_fail(context, **kwargs)
        if comment.author_id != context.user.id:
            raise ForbiddenError()

        return comment
