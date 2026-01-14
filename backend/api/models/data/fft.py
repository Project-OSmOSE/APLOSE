"""FFT model"""
from django.db import models


class FFT(models.Model):
    """FFT model"""

    class Meta:
        unique_together = (
            "nfft",
            "window_size",
            "overlap",
            "sampling_frequency",
            "scaling",
            "legacy",
        )

    def __str__(self):
        return f"{self.nfft} / {self.window_size} / {self.overlap}"

    nfft = models.IntegerField()
    window_size = models.IntegerField()
    overlap = models.DecimalField(decimal_places=2, max_digits=3)
    sampling_frequency = models.PositiveIntegerField()
    scaling = models.CharField(max_length=50, null=True, blank=True)

    # @deprecated("Do not use this field with the recent version of OSEkit")
    legacy = models.BooleanField(default=False)
