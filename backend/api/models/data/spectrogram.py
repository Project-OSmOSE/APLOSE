"""Spectrogram model"""
from datetime import datetime
from pathlib import Path, PureWindowsPath
from typing import TypedDict

from django.db import models
from django.db.models import Q, F, QuerySet
from osekit.core.spectro_data import SpectroData
from osekit.core.spectro_dataset import SpectroDataset

from backend.storage.utils import make_static_url, join, clean_path
from .__abstract_file import AbstractFile
from .__abstract_time_segment import TimeSegment
from .spectrogram_analysis import SpectrogramAnalysis


class SpectrogramManager(models.Manager):
    """Spectrogram manager"""

    def filter_for_file_range(self, file_range: "AnnotationFileRange"):
        """Get files for a given file range"""
        return self.filter(
            analysis__dataset_id=file_range.annotation_phase.annotation_campaign.dataset_id,
            start__gte=file_range.from_datetime,
            end__lte=file_range.to_datetime,
        )

    def filter_matches_time_range(
        self, start: datetime, end: datetime
    ) -> QuerySet["Spectrogram"]:
        """Get files from absolute start and ends"""
        return self.filter(
            Q(start__lte=start, end__gt=start)
            | Q(start__gte=start, end__lte=end)
            | Q(start__lt=end, end__gte=end)
        ).order_by("start", "id")


class Spectrogram(AbstractFile, TimeSegment, models.Model):
    """Spectrogram model"""

    objects = SpectrogramManager()

    class Meta:
        ordering = ("start", "id")
        constraints = [
            models.CheckConstraint(
                name="start is lower than end", check=Q(start__lt=F("end"))
            )
        ]

    def __str__(self):
        return f"{self.filename}.{self.format}"

    analysis = models.ManyToManyField(
        SpectrogramAnalysis,
        related_name="spectrograms",
        through="SpectrogramAnalysisRelation",
    )


class Paths(TypedDict):
    audio: str | None
    spectrogram: str


class SpectrogramAnalysisRelation(models.Model):
    """Spectrogram <> SpectrogramAnalysis manyToMany relation table"""

    class Meta:
        unique_together = (("analysis", "spectrogram"),)

    spectrogram = models.ForeignKey(
        Spectrogram, on_delete=models.CASCADE, related_name="analysis_relations"
    )
    analysis = models.ForeignKey(
        SpectrogramAnalysis,
        on_delete=models.PROTECT,
        related_name="spectrogram_relations",
    )

    spectrogram_path = models.TextField(blank=True, null=True)
    audio_path = models.TextField(blank=True, null=True)

    def get_paths(
        self, spectro_dataset: SpectroDataset, spectro_data: SpectroData
    ) -> Paths:
        """Set paths for OSEkit data"""
        file = (
            list(spectro_data.audio_data.files)[0]
            if len(spectro_data.audio_data.files) > 0
            else None
        )
        return {
            "audio": make_static_url(Path(file.path).resolve()) if file else None,
            "spectrogram": make_static_url(
                join(
                    clean_path(spectro_dataset.folder),
                    "spectrogram",
                    f"{self.spectrogram.filename}.png",
                )
            ),
        }

    def get_legacy_paths(self) -> Paths:
        """Set paths for Legacy OSEkit data"""
        config = PureWindowsPath(self.analysis.path).parts[-2]
        return {
            "audio": make_static_url(
                join(
                    self.analysis.dataset.path,
                    "data/audio",
                    config,
                    f"{self.spectrogram.filename}.wav",
                )
            ),
            "spectrogram": make_static_url(
                join(
                    self.analysis.dataset.path,
                    self.analysis.path,
                    "image",
                    f"{self.spectrogram.filename}.png",
                )
            ),
        }
