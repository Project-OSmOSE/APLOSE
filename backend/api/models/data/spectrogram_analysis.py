"""Spectrogram analysis model"""
from datetime import datetime
from pathlib import Path
from typing import Optional
import logging

from django.conf import settings
from django.db import models
from django.db.models import Manager

from backend.aplose.models import User
from backend.utils.spectrogram.dataset import SpectrogramFile
from .__abstract_analysis import AbstractAnalysis
from .colormap import Colormap
from .dataset import Dataset
from .fft import FFT

logger = logging.getLogger(__name__)


class SpectrogramAnalysisManager(Manager):
    """Spectrogram analysis manager for simple NetCDF datasets"""

    def import_for_dataset(
        self, dataset: Dataset, name: str, path: str, owner: User
    ) -> "SpectrogramAnalysis":
        """
        Import a spectrogram analysis from a NetCDF file

        Args:
            dataset: Parent dataset
            name: Analysis name (usually NetCDF filename without extension)
            path: Relative path from DATASET_IMPORT_FOLDER to NetCDF file
            owner: User importing the dataset

        Returns:
            SpectrogramAnalysis instance
        """
        # Get full path to NetCDF file
        netcdf_path = settings.DATASET_IMPORT_FOLDER / path

        if not netcdf_path.exists():
            raise ValueError(f"NetCDF file not found: {netcdf_path}")

        try:
            # Load spectrogram metadata
            spec_file = SpectrogramFile(netcdf_path)
            metadata = spec_file.metadata

            # Parse timestamps
            begin_str = metadata.get('begin', '')
            end_str = metadata.get('end', '')

            try:
                start = datetime.fromisoformat(begin_str.replace('+0000', '').replace('Z', ''))
            except (ValueError, AttributeError):
                logger.warning(f"Could not parse start time from '{begin_str}', using epoch")
                start = datetime(1970, 1, 1)

            try:
                end = datetime.fromisoformat(end_str.replace('+0000', '').replace('Z', ''))
            except (ValueError, AttributeError):
                logger.warning(f"Could not parse end time from '{end_str}', using epoch")
                end = datetime(1970, 1, 1)

            # Get or create default colormap
            colormap, _ = Colormap.objects.get_or_create(name='viridis')

            # Create SpectrogramAnalysis
            return SpectrogramAnalysis.objects.create(
                dataset=dataset,
                name=name,
                path=str(path),
                owner=owner,
                start=start,
                end=end,
                sample_rate=metadata.get('sample_rate', 48000),
                nfft=metadata.get('nfft', 2048),
                hop_length=metadata.get('hop_length', 512),
                duration=metadata.get('duration', 0.0),
                colormap=colormap,
                dynamic_min=0.0,  # Will be calculated dynamically from NetCDF
                dynamic_max=100.0,  # Will be calculated dynamically from NetCDF
                frequency_min=metadata.get('frequency_min', 0.0),
                frequency_max=metadata.get('frequency_max', 24000.0),
            )

        except Exception as e:
            logger.error(f"Failed to import analysis '{name}': {e}")
            raise


class SpectrogramAnalysis(AbstractAnalysis, models.Model):
    """
    Spectrogram analysis model for simple NetCDF datasets

    Each analysis represents a single NetCDF spectrogram file.
    """

    objects = SpectrogramAnalysisManager()

    class Meta:
        verbose_name_plural = "Spectrogram analysis"
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.dataset}: {self.name}"

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="spectrogram_analysis",
    )

    dataset = models.ForeignKey(
        Dataset,
        on_delete=models.CASCADE,
        related_name="spectrogram_analysis",
    )

    # Simple NetCDF metadata fields
    sample_rate = models.FloatField(
        help_text="Sample rate in Hz",
        default=48000
    )

    nfft = models.IntegerField(
        help_text="FFT size",
        default=2048
    )

    hop_length = models.IntegerField(
        help_text="Hop length for STFT",
        default=512
    )

    duration = models.FloatField(
        help_text="Duration in seconds",
        default=0.0
    )

    # Old OSEkit field - kept for backward compatibility (nullable)
    fft = models.ForeignKey(
        FFT,
        on_delete=models.PROTECT,
        related_name="spectrogram_analysis",
        null=True,
        blank=True,
        help_text="FFT configuration (for old OSEkit datasets)"
    )

    colormap = models.ForeignKey(
        Colormap,
        on_delete=models.PROTECT,
        related_name="spectrogram_analysis",
        null=True,
        blank=True
    )

    dynamic_min = models.FloatField(
        help_text="Minimum value for display",
        default=0.0
    )

    dynamic_max = models.FloatField(
        help_text="Maximum value for display",
        default=100.0
    )

    frequency_min = models.FloatField(
        help_text="Minimum frequency in Hz",
        default=0.0
    )

    frequency_max = models.FloatField(
        help_text="Maximum frequency in Hz",
        default=24000.0
    )

    def get_netcdf_path(self) -> Path:
        """Get full path to the NetCDF spectrogram file"""
        return settings.DATASET_IMPORT_FOLDER / self.path

    def get_spectrogram_file(self) -> SpectrogramFile:
        """Get SpectrogramFile object for this analysis"""
        return SpectrogramFile(self.get_netcdf_path())
