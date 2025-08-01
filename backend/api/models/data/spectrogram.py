"""Spectrogram model"""
import csv
from datetime import datetime, timedelta
from os.path import join
from pathlib import Path

from django.conf import settings
from django.db import models
from django.db.models import Q, F, Manager
from metadatax.data.models import FileFormat
from osekit.config import TIMESTAMP_FORMAT_EXPORTED_FILES_LOCALIZED

from .__abstract_file import AbstractFile
from .__abstract_time_segment import TimeSegment
from .spectrogram_analysis import SpectrogramAnalysis


class SpectrogramManager(Manager):  # pylint: disable=too-few-public-methods
    """Spectrogram manager"""

    def import_all_for_analysis(self, analysis: SpectrogramAnalysis) -> ["Spectrogram"]:
        """Import spectrograms for a given analysis"""

        spectrograms_data = []
        if analysis.dataset.legacy:
            audio_csv_path = join(
                settings.DATASET_IMPORT_FOLDER,
                analysis.dataset.path,
                "data",
                "audio",
                Path(analysis.path).parts[-2],  # audio config folder
                "metadata.csv",
            )
            with open(audio_csv_path, encoding="utf-8") as csvfile:
                audio: dict = next(csv.DictReader(csvfile))
            timestamp_csv_path = join(
                settings.DATASET_IMPORT_FOLDER,
                analysis.dataset.path,
                "data",
                "audio",
                Path(analysis.path).parts[-2],  # audio config folder
                "timestamp.csv",
            )
            with open(timestamp_csv_path, encoding="utf-8") as csvfile:
                files: [dict] = list(f for f in csv.DictReader(csvfile))
            file: dict
            for file in files:
                filename = Path(file["filename"]).stem
                start = datetime.fromisoformat(file["timestamp"])
                spectrograms_data.append(
                    {
                        "filename": filename,
                        "start": start,
                        "end": start
                        + timedelta(seconds=int(audio["audio_file_dataset_duration"])),
                    }
                )
        else:
            for data in analysis.get_osekit_spectro_dataset().data:
                spectrograms_data.append(
                    {
                        "filename": data.begin.strftime(
                            TIMESTAMP_FORMAT_EXPORTED_FILES_LOCALIZED
                        ),
                        "start": data.begin,
                        "end": data.end,
                    }
                )

        existing_spectrograms = []
        new_spectrograms = []
        img_format, _ = FileFormat.objects.get_or_create(name="png")
        dataset_spectrograms = Spectrogram.objects.filter(
            analysis__dataset=analysis.dataset
        )
        for data in spectrograms_data:
            if dataset_spectrograms.filter(
                filename=data["filename"],
                format=img_format,
                start=data["start"],
                end=data["end"],
            ).exists():
                existing_spectrograms.append(
                    dataset_spectrograms.filter(
                        filename=data["filename"],
                        format=img_format,
                        start=data["start"],
                        end=data["end"],
                    ).first()
                )
            else:
                new_spectrograms.append(
                    Spectrogram(
                        filename=data["filename"],
                        format=img_format,
                        start=data["start"],
                        end=data["end"],
                    )
                )

        new_spectrograms: [Spectrogram] = dataset_spectrograms.bulk_create(
            new_spectrograms, ignore_conflicts=True
        )

        spectrogram_analysis_rel = []
        spectrograms = existing_spectrograms + new_spectrograms
        for spectrogram in spectrograms:
            spectrogram.save()
            spectrogram_analysis_rel.append(
                Spectrogram.analysis.through(
                    spectrogram=spectrogram, spectrogramanalysis=analysis
                )
            )
        Spectrogram.analysis.through.objects.bulk_create(spectrogram_analysis_rel)
        return spectrograms


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

    analysis = models.ManyToManyField(SpectrogramAnalysis, related_name="spectrograms")
