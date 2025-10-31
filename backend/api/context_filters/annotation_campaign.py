from django.db.models import QuerySet, Q, Exists, OuterRef
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.request import Request

from backend.api.models import AnnotationFileRange, AnnotationCampaign
from backend.utils.schema import ForbiddenError, NotFoundError


class AnnotationCampaignContextFilter:
    """Filter campaign from the context"""

    @classmethod
    def get_queryset(
        cls, context: Request, queryset=AnnotationCampaign.objects.all()
    ) -> QuerySet[AnnotationCampaign]:
        """Get queryset depending on the context"""
        if context.user.is_staff or context.user.is_superuser:
            return queryset
        return queryset.filter(
            Q(owner_id=context.user.id)
            | (
                Q(archive__isnull=True)
                & Exists(
                    AnnotationFileRange.objects.filter(
                        annotation_phase__annotation_campaign_id=OuterRef("pk"),
                        annotator_id=context.user.id,
                    )
                )
            )
        )

    @classmethod
    def get_node_or_fail(cls, context: Request, **kwargs) -> AnnotationCampaign:
        """Get node or fail depending on the context"""
        try:
            return get_object_or_404(cls.get_queryset(context), **kwargs)
        except Http404:
            raise NotFoundError()

    @classmethod
    def get_edit_node_or_fail(cls, context: Request, **kwargs) -> AnnotationCampaign:
        """Get node with edit rights or fail depending on the context"""
        campaign: AnnotationCampaign = cls.get_node_or_fail(context, **kwargs)
        if not (
            campaign.owner_id == context.user.id
            or context.user.is_staff
            or context.user.is_superuser
        ):
            raise ForbiddenError()
        return campaign
