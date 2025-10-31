from django.db.models import QuerySet, Q, Exists, OuterRef
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.request import Request

from backend.api.models import AnnotationPhase, AnnotationFileRange
from backend.utils.schema import ForbiddenError, NotFoundError


class AnnotationPhaseContextFilter:
    """Filter phase from the context"""

    @classmethod
    def get_queryset(
        cls, context: Request, queryset=AnnotationPhase.objects.all()
    ) -> QuerySet[AnnotationPhase]:
        """Get queryset depending on the context"""

        if context.user.is_staff or context.user.is_superuser:
            return queryset
        return queryset.filter(
            Q(annotation_campaign__owner_id=context.user.id)
            | (
                Q(annotation_campaign__archive__isnull=True)
                & Exists(
                    AnnotationFileRange.objects.filter(
                        annotation_phase_id=OuterRef("pk"),
                        annotator_id=context.user.id,
                    )
                )
            )
        )

    @classmethod
    def get_node_or_fail(
        cls, context: Request, queryset=None, **kwargs
    ) -> AnnotationPhase:
        """Get node or fail depending on the context"""
        try:
            return get_object_or_404(
                cls.get_queryset(context, queryset=queryset), **kwargs
            )
        except Http404:
            raise NotFoundError()

    @classmethod
    def get_edit_node_or_fail(cls, context: Request, **kwargs) -> AnnotationPhase:
        """Get node with edit rights or fail depending on the context"""
        phase: AnnotationPhase = cls.get_node_or_fail(context, **kwargs)
        if not (
            phase.annotation_campaign.owner_id == context.user.id
            or context.user.is_staff
            or context.user.is_superuser
        ):
            raise ForbiddenError()
        return phase
