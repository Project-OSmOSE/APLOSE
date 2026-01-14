"""Confidence model"""
from django.db import models
from django.db.models import Q, QuerySet

from .confidence import Confidence


class ConfidenceSet(models.Model):
    """
    This table contains collections of confidence indicator to be used for annotation campaign.
    A confidence indicator set is created by a staff user.
    """

    def __str__(self):
        return str(self.name)

    name = models.CharField(max_length=255, unique=True)
    desc = models.TextField(null=True, blank=True)
    confidence_indicators = models.ManyToManyField(
        Confidence,
        related_name="confidence_indicator_sets",
        through="ConfidenceIndicatorSetIndicator",
    )

    # TODO:
    #  @property
    #  def max_level(self):
    #      """Give the max level among confidence indicators"""
    #      return max(i.level for i in self.confidence_indicators.all())

    @staticmethod
    def create_for_campaign(
        campaign: "AnnotationCampaign",
        confidences: QuerySet[Confidence] = Confidence.objects.none(),
        index: int = 0,
    ):
        """Recover new confidence set based on the campaign name"""
        real_name = campaign.name if index == 0 else f"{campaign.name} ({index})"
        if ConfidenceSet.objects.filter(name=real_name).exists():
            return ConfidenceSet.create_for_campaign(campaign, confidences, index + 1)
        confidence_set: ConfidenceSet = ConfidenceSet.objects.create(name=real_name)
        for confidence in confidences.all():
            ConfidenceIndicatorSetIndicator.objects.create(
                confidence_set=confidence_set, confidence=confidence
            )
        return confidence_set


class ConfidenceIndicatorSetIndicator(models.Model):
    """This table describe the link between confidence indicator set and confidence indicator"""

    class Meta:
        constraints = [
            models.UniqueConstraint(
                name="one_default_confidence_by_set",
                fields=["is_default", "confidence_set"],
                condition=Q(is_default=True),
            ),
            models.UniqueConstraint(
                name="no_duplicate_confidence_in_set",
                fields=["confidence", "confidence_set"],
            ),
        ]

    confidence = models.ForeignKey(
        Confidence,
        related_name="set_relations",
        on_delete=models.CASCADE,
    )
    confidence_set = models.ForeignKey(
        "ConfidenceSet",
        related_name="indicator_relations",
        on_delete=models.CASCADE,
    )
    is_default = models.BooleanField(default=False)
