"""Detector configuration model"""
from django.db import models

from .detector import Detector


class DetectorConfiguration(models.Model):
    """
    This table represents a detector
    """

    class Meta:
        unique_together = ("configuration", "detector")

    def __str__(self):
        return self.detector.name + ": " + self.configuration

    configuration = models.TextField()
    detector = models.ForeignKey(
        Detector, on_delete=models.CASCADE, related_name="configurations"
    )
