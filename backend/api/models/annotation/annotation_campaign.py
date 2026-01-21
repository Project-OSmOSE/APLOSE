"""Campaign model"""
from typing import Optional

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models, transaction
from django.db.models import signals, Q, QuerySet, Exists, OuterRef
from django.dispatch import receiver
from django.utils import timezone
from django_extension.models import ExtendedQuerySet

from backend.aplose.models import User
from .annotation_phase import AnnotationPhase
from .confidence import Confidence
from .confidence_set import ConfidenceSet, ConfidenceIndicatorSetIndicator
from .label import Label
from .label_set import LabelSet
from ..common import Archive
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
        open_campaigns = qs.filter(archive__isnull=True)

        # Admin can edit all campaigns
        if user.is_staff or user.is_superuser:
            return open_campaigns

        # Campaign owner can edit their campaigns
        return open_campaigns.filter(owner_id=user.id)


class AnnotationCampaign(models.Model):
    """Campaign to make annotation on the designated dataset with the given label set and confidence indicator set"""

    objects = models.Manager.from_queryset(AnnotationCampaignQuerySet)()

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return str(self.name)

    created_at = models.DateTimeField(default=timezone.now, editable=False)
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(null=True, blank=True)
    instructions_url = models.URLField(null=True, blank=True)
    deadline = models.DateField(null=True, blank=True)

    label_set = models.ForeignKey(
        LabelSet, on_delete=models.PROTECT, null=True, blank=True
    )
    labels_with_acoustic_features = models.ManyToManyField(Label, blank=True)
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

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)

    confidence_set = models.ForeignKey(
        ConfidenceSet, on_delete=models.SET_NULL, null=True, blank=True
    )
    archive = models.OneToOneField(
        Archive,
        related_name="annotation_campaign",
        on_delete=models.SET_NULL,
        null=True,
    )

    @transaction.atomic
    def do_archive(self, user: User):
        """Archive current campaign"""
        if self.archive is not None:
            return
        self.archive = Archive.objects.create(by_user=user)
        self.save()
        for phase in self.phases.all():
            phase.end(user)

    def get_sorted_files(self) -> QuerySet[Spectrogram]:
        """Return sorted dataset files"""
        return (
            Spectrogram.objects.filter(analysis__in=self.analysis.all())
            .order_by("start", "id")
            .distinct()
        )

    @transaction.atomic
    def update_labels_with_acoustic_features(self, new_labels: [str]):
        """Update labels with acoustic features"""
        removed_labels = self.labels_with_acoustic_features.filter(
            ~Q(name__in=new_labels)
        )
        for label in removed_labels:
            self.labels_with_acoustic_features.remove(label)

        added_labels = self.label_set.labels.filter(name__in=new_labels)
        for label in added_labels:
            if not self.labels_with_acoustic_features.filter(name=label.name).exists():
                self.labels_with_acoustic_features.add(label)

    @property
    def spectrograms(self) -> QuerySet[Spectrogram]:
        """Recover campaign spectrograms"""
        return Spectrogram.objects.filter(
            analysis__annotation_campaigns=self
        ).distinct()

    def import_new_label(self, name: str) -> Label:
        """Import new label into campaign label set"""
        label: Label = Label.objects.get_or_create(name=name)[0]
        if not self.label_set.labels.filter(
            id=label.id
        ).exists():  # If the campaign's label set doesn't contain this label
            if (
                self.label_set.annotationcampaign_set.count() > 1
            ):  # If the campaign's label set also belong to other campaigns
                # Duplicate label set
                old_label_set = self.label_set
                self.label_set = LabelSet.create_for_campaign(
                    campaign=self,
                    labels=old_label_set.labels,
                )
                self.save()
            self.label_set.labels.add(label)
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


@receiver(
    signal=signals.m2m_changed,
    sender=AnnotationCampaign.labels_with_acoustic_features.through,
)
def check_labels_features_in_label_set(sender, **kwargs):
    """Check added labels in labels_with_acoustic_features does belong to the campaign label_set"""
    action = kwargs.pop("action", None)
    if action != "pre_add":
        return
    campaign: Optional[AnnotationCampaign] = kwargs.pop("instance", None)
    if not campaign:
        return
    pk_set = kwargs.pop("pk_set", {})
    for pk in pk_set:
        label = Label.objects.get(pk=pk)
        if not label:
            continue
        if label not in campaign.label_set.labels.all():
            raise ValidationError(
                {
                    "labels_with_acoustic_features": "Label with acoustic features should belong to label set"
                },
                code="invalid",
            )
