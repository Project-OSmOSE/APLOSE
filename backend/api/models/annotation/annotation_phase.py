"""Phase model"""
from django.conf import settings
from django.db import models, transaction
from django.db.models import Q
from django.utils import timezone
from django_extension.models import ExtendedEnum, ExtendedQuerySet

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
            annotation_campaign__archive__isnull=True,
            ended_at__isnull=True,
            ended_by__isnull=True,
        )

        # Admin can edit all phases
        if user.is_staff or user.is_superuser:
            return open_phases

        # Campaign owner can edit its phases
        return open_phases.filter(annotation_campaign__owner_id=user.id)


class AnnotationPhase(models.Model):
    """Annotation campaign phase"""

    objects = models.Manager.from_queryset(AnnotationPhaseQuerySet)()

    class Type(ExtendedEnum):
        """Available type of phases of the annotation campaign"""

        ANNOTATION = "A", "Annotation"
        VERIFICATION = "V", "Verification"

    class Meta:
        unique_together = (("phase", "annotation_campaign"),)

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

    ended_at = models.DateTimeField(blank=True, null=True)
    ended_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="ended_phases",
        blank=True,
        null=True,
    )

    @property
    def is_open(self) -> bool:
        """Get open state of the phase"""
        if not self.ended_at or not self.ended_by:
            return True
        return False

    @transaction.atomic
    def end(self, user: User):
        """End the phase"""
        self.ended_at = timezone.now()
        self.ended_by = user
        self.save()
