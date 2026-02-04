"""Acoustic features model"""

from django.core.validators import MinValueValidator
from django.db import models


class AcousticFeatures(models.Model):
    """
    Precise signal properties to annotate on the signal of interest
    Acoustic features only exist for annotations on a single signal
    """

    class SignalTrend(models.TextChoices):
        """General trend of a call"""

        FLAT = ("FLAT", "Flat")
        ASCENDING = ("ASC", "Ascending")
        DESCENDING = ("DESC", "Descending")
        MODULATED = ("MOD", "Modulated")

    class Meta:
        verbose_name_plural = "Acoustic features"

    is_intensity_too_low = models.BooleanField(null=True, blank=True)
    does_overlap_other_signals = models.BooleanField(null=True, blank=True)

    # Frequency
    start_frequency = models.FloatField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        help_text="[Hz] Frequency at the beginning of the signal",
    )
    end_frequency = models.FloatField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        help_text="[Hz] Frequency at the end of the signal",
    )
    relative_min_frequency_count = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        help_text="Number of relative minimum frequency in the signal",
    )
    relative_max_frequency_count = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        help_text="Number of relative maximum frequency in the signal",
    )
    steps_count = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        help_text="Number of steps (flat segment) in the signal",
    )
    has_harmonics = models.BooleanField(
        null=True, blank=True, help_text="If the signal has harmonics"
    )

    trend = models.CharField(
        choices=SignalTrend.choices, null=True, blank=True, max_length=10
    )

    # Non-linear phenomena
    has_sidebands = models.BooleanField(null=True, blank=True)
    has_subharmonics = models.BooleanField(null=True, blank=True)
    has_frequency_jumps = models.BooleanField(null=True, blank=True)
    frequency_jumps_count = models.IntegerField(null=True, blank=True)
    has_deterministic_chaos = models.BooleanField(null=True, blank=True)

    @property
    def inflexion_point_count(self) -> int:
        """Number of inflexion point count"""
        return (self.relative_min_frequency_count or 0) + (
            self.relative_min_frequency_count or 0
        )
