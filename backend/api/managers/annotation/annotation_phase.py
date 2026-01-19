"""Phase model manager"""
from django.contrib.auth.models import User
from django.db.models import Q, Exists, OuterRef

from backend.api.models.annotation.annotation_file_range import AnnotationFileRange
from backend.utils.managers import CustomManager


class AnnotationPhaseManager(CustomManager):
    def filter_viewable_by(self, user: User, **kwargs):
        qs = super().filter_viewable_by(user, **kwargs)

        # Admin can view all phases
        if user.is_staff or user.is_superuser:
            return qs

        return qs.filter(
            # Campaign owner can view its phases
            Q(annotation_campaign__owner_id=user.id)
            |
            # Other can only view assigned open phase
            (
                Q(
                    annotation_campaign__archive__isnull=True,
                    ended_at__isnull=True,
                    ended_by__isnull=True,
                )  # Is open
                & Exists(
                    AnnotationFileRange.objects.filter(
                        annotation_phase_id=OuterRef("pk"),
                        annotator_id=user.id,
                    )  # Is assigned
                )
            )
        )

    def filter_editable_by(self, user: User, **kwargs):
        qs = super().filter_viewable_by(user, **kwargs)

        # Only open phases can be edited
        open_phases = qs.filter(
            annotation_campaign__archive__isnull=True,
            ended_at__isnull=True,
            ended_by__isnull=True,
        )

        # Admin can edit all phases
        if user.is_staff or user.is_superuser:
            return open_phases

        # Campaign owner can edit its phases
        return open_phases.filter(annotation_campaign__owner_id=user.id)
