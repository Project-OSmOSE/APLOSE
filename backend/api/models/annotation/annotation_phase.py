"""Phase model"""
from django.conf import settings
from django.db import models
from django.db.models import Q, CheckConstraint
from django_extension.models import ExtendedEnum, ExtendedQuerySet

from backend.api.models.common.__abstract_archivable import AbstractArchivable
from backend.aplose.models import User


class AnnotationPhaseQuerySet(ExtendedQuerySet):
    def filter_viewable_by(self, user: User, **kwargs):
        qs = super().filter_viewable_by(user, **kwargs)

        # Admin can view all phases
        if user.is_staff or user.is_superuser:
            return qs

        return qs.filter(
            # Campaign owner can view its phases
            Q(annotation_campaign__owner_id=user.id)
            |
            # Phase creator can view them
            Q(created_by_id=user.id)
            |
            # Annotators can view assigned phases
            Q(annotation_file_ranges__annotator_id=user.id)
        ).distinct()

    def filter_editable_by(self, user: User, **kwargs):
        qs = super().filter_viewable_by(user, **kwargs)

        # Only open phases can be edited
        open_phases = qs.filter(
            annotation_campaign__archived=False,
            archived=False,
        )

        # Admin can edit all phases
        if user.is_staff or user.is_superuser:
            return open_phases

        # Campaign owner can edit its phases
        return open_phases.filter(annotation_campaign__owner_id=user.id)


class AnnotationPhase(AbstractArchivable, models.Model):
    """Annotation campaign phase"""

    objects = models.Manager.from_queryset(AnnotationPhaseQuerySet)()

    class Type(ExtendedEnum):
        """Available type of phases of the annotation campaign"""

        ANNOTATION = "A", "Annotation"
        VERIFICATION = "V", "Verification"

    class Meta:
        unique_together = (("phase", "annotation_campaign"),)
        constraints = [
            CheckConstraint(
                name="phase_archive_info",
                condition=Q(
                    archived=True, archived_at__isnull=False, archived_by__isnull=False
                )
                | Q(archived=False, archived_at__isnull=True, archived_by__isnull=True),
            )
        ]

    def __str__(self):
        return f"{self.annotation_campaign} - {self.Type(self.phase).label}"

    phase = models.CharField(choices=Type.choices, max_length=1)
    annotation_campaign = models.ForeignKey(
        "AnnotationCampaign",
        on_delete=models.CASCADE,
        related_name="phases",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_phases",
    )

    # pylint: disable=duplicate-code
    archived_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="archived_phases",
    )

    def has_change_permission(self, user: "User") -> bool:
        return (
            super().has_change_permission(user)
            or user.id == self.created_by_id
            or user.id == self.annotation_campaign.owner_id
        )
