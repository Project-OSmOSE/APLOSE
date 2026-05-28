"""Spectrogram scale models"""

from django.db import models


class LinearScale(models.Model):
    """Linear spectrogram scale"""

    def __str__(self):
        if self.name:
            return self.name
        return f"Linear ({self.min_value} - {self.max_value})[{self.ratio}]"

    name = models.CharField(max_length=255, blank=True, null=True)
    ratio = models.FloatField(default=1)
    min_value = models.FloatField()
    max_value = models.FloatField()


class MultiLinearScale(models.Model):
    """Multi-linear spectrogram scale"""

    def __str__(self):
        if self.name:
            return self.name
        return f"Multi-Linear {self.id}"

    name = models.CharField(max_length=255, blank=True, null=True)
    inner_scales = models.ManyToManyField(LinearScale, related_name="outer_scales")


def get_frequency_scale_parts(name: str | None, sample_rate: int) -> list[LinearScale]:
    """return scale type, min freq, max freq and parameters for multiscale"""
    if name is None:
        return []
    if name.lower() == "porp_delph":
        return [
            LinearScale.objects.get_or_create(ratio=0.5, min_value=0, max_value=30_000)[
                0
            ],
            LinearScale.objects.get_or_create(
                ratio=0.7, min_value=30_000, max_value=80_000
            )[0],
            LinearScale.objects.get_or_create(
                ratio=1, min_value=80_000, max_value=sample_rate / 2
            )[0],
        ]
    if name.lower() == "dual_lf_hf":
        return [
            LinearScale.objects.get_or_create(ratio=0.5, min_value=0, max_value=22_000)[
                0
            ],
            LinearScale.objects.get_or_create(
                ratio=1, min_value=100_000, max_value=sample_rate / 2
            )[0],
        ]
    if name.lower() == "audible":
        return [
            LinearScale.objects.get_or_create(
                name="audible", min_value=0, max_value=22_000
            )[0]
        ]
    return []
