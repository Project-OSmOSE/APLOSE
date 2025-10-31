from django.db.models import QuerySet, Exists, OuterRef
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.request import Request

from backend.api.models import AnnotationFileRange
from backend.utils.schema import ForbiddenError, NotFoundError
from .annotation_phase import AnnotationPhaseContextFilter


class AnnotationFileRangeContextFilter:
    """Filter file range from the context"""

    @classmethod
    def get_queryset(
        cls, context: Request, queryset=AnnotationFileRange.objects.all()
    ) -> QuerySet[AnnotationFileRange]:
        """Get queryset depending on the context"""
        if context.user.is_staff or context.user.is_superuser:
            return queryset
        return queryset.filter(
            Exists(
                AnnotationPhaseContextFilter.get_queryset(
                    context, id=OuterRef("annotation_phase_id")
                )
            )
        )

    @classmethod
    def get_node_or_fail(cls, context: Request, **kwargs) -> AnnotationFileRange:
        """Get node or fail depending on the context"""
        try:
            return get_object_or_404(cls.get_queryset(context), **kwargs)
        except Http404:
            raise NotFoundError()

    @classmethod
    def get_edit_node_or_fail(cls, context: Request, **kwargs) -> AnnotationFileRange:
        """Get node with edit rights or fail depending on the context"""
        file_range: AnnotationFileRange = cls.get_node_or_fail(context, **kwargs)
        if not (
            file_range.annotation_phase.annotation_campaign.owner_id == context.user.id
            or context.user.is_staff
            or context.user.is_superuser
        ):
            raise ForbiddenError()
        return file_range
