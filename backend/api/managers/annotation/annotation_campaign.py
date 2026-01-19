"""Campaign model"""

from django.contrib.auth.models import User
from django.db.models import Q, Exists, OuterRef

from backend.api.models.annotation.annotation_phase import AnnotationPhase
from backend.utils.managers import CustomManager


class AnnotationCampaignManager(CustomManager):
    """AnnotationCampaign custom manager"""

    def filter_viewable_by(self, user: User, **kwargs):
        qs = super().filter_viewable_by(user, **kwargs)

        # Admin can view all campaigns
        if user.is_staff or user.is_superuser:
            return qs

        return qs.filter(
            # Campaign owner can view their campaigns
            Q(owner_id=user.id)
            |
            # Other can only view campaigns with assigned open phase
            (
                # Open campaigns
                Q(archive__isnull=True)
                # Assigned open phases
                & Exists(
                    AnnotationPhase.objects.filter_viewable_by(
                        user, annotation_campaign_id=OuterRef("pk")
                    )
                )
            )
        )

    def filter_editable_by(self, user: User, **kwargs):
        qs = super().filter_viewable_by(user, **kwargs)

        # Only open campaigns can be edited
        open_campaigns = qs.filter(archive__isnull=True)

        # Admin can edit all campaigns
        if user.is_staff or user.is_superuser:
            return open_campaigns

        # Campaign owner can edit their campaigns
        return open_campaigns.filter(owner_id=user.id)
