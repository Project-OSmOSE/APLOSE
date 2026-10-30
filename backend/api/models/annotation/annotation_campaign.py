"""Campaign model"""
# pylint: disable=duplicate-code
from typing import Optional

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models, transaction
from django.db.models import signals, Q, QuerySet, Exists, OuterRef, CheckConstraint
from django.dispatch import receiver
from django.utils import timezone
from django_extension.models import ExtendedQuerySet
from metadatax.ontology.models import Label

from backend.api.models.common.__abstract_archivable import AbstractArchivable
from backend.aplose.models import User
from .annotation_phase import AnnotationPhase
from .confidence import Confidence
from .confidence_set import ConfidenceSet, ConfidenceIndicatorSetIndicator
from .label_set import LabelSet
from ..data import Dataset, SpectrogramAnalysis, Spectrogram


class AnnotationCampaignQuerySet(ExtendedQuerySet):
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
            Exists(
                AnnotationPhase.objects.filter_viewable_by(
                    user, annotation_campaign_id=OuterRef("pk")
                )
            )
        )

    def filter_editable_by(self, user: User, **kwargs):
        qs = super().filter_viewable_by(user, **kwargs)

        # Only open campaigns can be edited
        open_campaigns = qs.filter(archived=False)

        # Admin can edit all campaigns
        if user.is_staff or user.is_superuser:
            return open_campaigns

        # Campaign owner can edit their campaigns
        return open_campaigns.filter(owner_id=user.id)


class AnnotationCampaign(AbstractArchivable, models.Model):
    """Campaign to make annotation on the designated dataset with the given label set and confidence indicator set"""

    objects = models.Manager.from_queryset(AnnotationCampaignQuerySet)()

    class Meta:
        ordering = ["name"]
        constraints = [
            CheckConstraint(
                name="campaign_archive_info",
                condition=Q(
                    archived=True, archived_at__isnull=False, archived_by__isnull=False
                )
                | Q(archived=False, archived_at__isnull=True, archived_by__isnull=True),
            )
        ]

    def __str__(self):
        return str(self.name)

    created_at = models.DateTimeField(default=timezone.now, editable=False)
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(null=True, blank=True)
    instructions_url = models.URLField(null=True, blank=True)
    deadline = models.DateField(null=True, blank=True)

    labels = models.ManyToManyField(
        Label,
        blank=True,
        through="AnnotationCampaignLabel",
        related_name="annotation_campaigns",
    )
    allow_point_annotation = models.BooleanField(default=False)
    dataset = models.ForeignKey(
        Dataset,
        related_name="annotation_campaigns",
        on_delete=models.PROTECT,
    )
    analysis = models.ManyToManyField(
        SpectrogramAnalysis,
        related_name="annotation_campaigns",
        through="AnnotationCampaignAnalysis",
    )
    allow_image_tuning = models.BooleanField(blank=False, default=False)
    allow_colormap_tuning = models.BooleanField(blank=False, default=False)
    colormap_default = models.TextField(null=True, blank=True)
    colormap_inverted_default = models.BooleanField(blank=True, null=True)
    allow_digital_zoom = models.BooleanField(blank=False, default=False)

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)

    confidence_set = models.ForeignKey(
        ConfidenceSet, on_delete=models.SET_NULL, null=True, blank=True
    )

    archived_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="archived_campaigns",
    )

    def has_change_permission(self, user: "User") -> bool:
        return super().has_change_permission(user) or user.id == self.owner_id

    def archive(self, user: "User"):
        super().archive(user)
        for phase in self.phases.all():
            phase.archive(user)

    def get_sorted_files(self) -> QuerySet[Spectrogram]:
        """Return sorted dataset files"""
        return (
            Spectrogram.objects.filter(analysis__in=self.analysis.all())
            .order_by("start", "id")
            .distinct()
        )

    @property
    def spectrograms(self) -> QuerySet[Spectrogram]:
        """Recover campaign spectrograms"""
        return Spectrogram.objects.filter(
            analysis__annotation_campaigns=self
        ).distinct()

    def import_new_label(self, label: Label) -> Label:
        """Import new label into campaign label set"""
        if not self.labels.filter(id=label.id).exists():
            self.annotationcampaignlabel_set.create(
                label=label
            )
        return label

    def import_new_confidence(self, label: str, level: int) -> Confidence:
        """Import new confidence into campaign confidence set"""
        confidence: Confidence = Confidence.objects.get_or_create(
            label=label, level=level
        )[0]

        if self.confidence_set is None:
            # Create confidence set if none exists
            self.confidence_set = ConfidenceSet.create_for_campaign(campaign=self)
            self.save()
        elif not self.confidence_set.confidence_indicators.filter(
            id=confidence.id
        ).exists():  # If the campaign's confidence set doesn't contain this confidence
            if (
                self.confidence_set.annotationcampaign_set.count() > 1
            ):  # If the campaign's confidence set also belong to other campaigns
                old_set = self.confidence_set
                self.confidence_set = ConfidenceSet.create_for_campaign(
                    campaign=self, confidences=old_set.confidence_indicators.all()
                )
                self.save()
        ConfidenceIndicatorSetIndicator.objects.get_or_create(
            confidence=confidence,
            confidence_set=self.confidence_set,
        )
        return confidence


class AnnotationCampaignAnalysis(models.Model):
    """AnnotationCampaign <> Analysis manyToMany relation table"""

    class Meta:
        unique_together = ("annotation_campaign", "analysis")

    annotation_campaign = models.ForeignKey(
        AnnotationCampaign, on_delete=models.CASCADE
    )
    analysis = models.ForeignKey(SpectrogramAnalysis, on_delete=models.PROTECT)

    # TODO: check analysis is from the same dataset as campaign


class AnnotationCampaignLabel(models.Model):
    """AnnotationCampaign <> Label manyToMany relation table"""

    class Meta:
        unique_together = ("annotation_campaign", "label")

    annotation_campaign = models.ForeignKey(
        AnnotationCampaign, on_delete=models.CASCADE
    )
    label = models.ForeignKey(Label, on_delete=models.PROTECT)

    enable_acoustic_features = models.BooleanField(default=False)
