"""Abstract analysis model"""
from django.conf import settings
from django.db import models

from .__abstract_dataset import AbstractDataset
from .dataset import Dataset


class AbstractAnalysis(AbstractDataset, models.Model):
    """Abstract analysis"""

    class Meta:
        abstract = True

    def __str__(self):
        return self.name

    start = models.DateTimeField(null=True, blank=True)
    end = models.DateTimeField(null=True, blank=True)

    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE)

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="spectrogram_analysis",
    )
