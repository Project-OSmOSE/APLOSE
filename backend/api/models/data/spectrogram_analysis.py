"""Spectrogram analysis model"""
from os.path import join
from pathlib import Path

from dateutil import parser
from django.conf import settings
from django.db import models, transaction
from django.db.models import CheckConstraint, Q, Min, Max
from typing_extensions import deprecated

from .__abstract_analysis import AbstractAnalysis
from .colormap import Colormap
from .dataset import Dataset
from .fft import FFT


class SpectrogramAnalysis(AbstractAnalysis, models.Model):
    """Spectrogram analysis"""

    class Meta:
        verbose_name_plural = "Spectrogram analysis"
        constraints = [
            CheckConstraint(
                name="spectrogram_analysis_legacy",
                check=Q(legacy=True) | Q(legacy=False, data_duration__isnull=False),
            )
        ]
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.dataset}: {self.fft}"

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

    data_duration = models.FloatField(
        help_text="Duration of the segmented data (in s)", blank=True, null=True
    )

    fft = models.ForeignKey(
        FFT, on_delete=models.PROTECT, related_name="spectrogram_analysis"
    )
    colormap = models.ForeignKey(
        Colormap, on_delete=models.PROTECT, related_name="spectrogram_analysis"
    )

    dynamic_min = models.FloatField()
    dynamic_max = models.FloatField()

    @deprecated("Related to legacy OSEkit")  # Legacy
    def legacy_audio_metadatum_csv(self) -> str:
        """Legacy audio metadata CSV export"""
        # pylint: disable=no-member
        header = [
            "dataset",
            "analysis",
            "files_subtypes",
            "channel_count",
            "audio_file_count",
            "start_date",
            "end_date",
            "dataset_sr",
            "audio_file_dataset_duration",
        ]
        data = [header]
        metadatum_data = []
        for label in header:
            if label == "dataset":
                metadatum_data.append(self.dataset.name)
            elif label == "analysis":
                metadatum_data.append(self.name)
            elif label == "files_subtypes":
                metadatum_data.append(
                    f'"{str(self.legacy_configuration.audio_files_subtypes)}"'
                )
            elif label == "channel_count":
                metadatum_data.append(str(self.legacy_configuration.channel_count))
            elif label == "audio_file_count":
                metadatum_data.append(str(self.spectrograms.count()))
            elif label == "start_date":
                metadatum_data.append(
                    parser.parse(
                        str(min(*self.spectrograms.values_list("start", flat=True)))
                    ).isoformat()
                )
            elif label == "end_date":
                metadatum_data.append(
                    parser.parse(
                        str(max(*self.spectrograms.values_list("end", flat=True)))
                    ).isoformat()
                )
            elif label == "dataset_sr":
                metadatum_data.append(str(self.fft.sampling_frequency))
            elif label == "audio_file_dataset_duration":
                metadatum_data.append(str(self.data_duration))
        data.append(metadatum_data)

        return "\n".join([",".join(line) for line in data])

    @deprecated("Related to legacy OSEkit")  # Legacy
    def legacy_spectrogram_configuration_csv(self) -> str:
        """Legacy spectrogram configuration CSV export"""
        # pylint: disable=no-member

        header = [
            "dataset_name",
            "analysis_name",
            "dataset_sr",
            "nfft",
            "window_size",
            "overlap",
            "colormap",
            "zoom_level",
            "dynamic_min",
            "dynamic_max",
            "spectro_duration",
            "data_normalization",
            "hp_filter_min_freq",
            "sensitivity_dB",  # seulement pour normalisation instrument / vide pour zscore
            "peak_voltage",  # seulement pour normalisation instrument / vide pour zscore
            "gain_dB",  # seulement pour normalisation instrument / vide pour zscore
            "spectro_normalization",
            "zscore_duration",  # seulement pour normalisation zscore / vide pour instrument
            "window_type",
            "frequency_resolution",
            "temporal_resolution",
            "audio_file_dataset_overlap",
        ]
        data = [header]
        config_data = []
        config_data.append(self.dataset.name)  # dataset_name
        config_data.append(self.name)  # analysis_name
        config_data.append(str(self.fft.sampling_frequency))  # dataset_sr
        config_data.append(str(self.fft.nfft))  # nfft
        config_data.append(str(self.fft.window_size))  # window_size
        config_data.append(str(self.fft.overlap * 100))  # overlap
        config_data.append(self.colormap.name)  # colormap
        config_data.append(str(self.legacy_configuration.zoom_level))  # zoom_level
        config_data.append(str(self.dynamic_min))  # dynamic_min
        config_data.append(str(self.dynamic_max))  # dynamic_max
        config_data.append(str(self.data_duration))  # spectro_duration
        config_data.append(
            str(self.legacy_configuration.data_normalization)
        )  # data_normalization
        config_data.append(
            str(self.legacy_configuration.hp_filter_min_frequency)
        )  # hp_filter_min_freq
        config_data.append(
            str(self.legacy_configuration.sensitivity_dB)
        )  # sensitivity_dB
        config_data.append(str(self.legacy_configuration.peak_voltage))  # peak_voltage
        config_data.append(str(self.legacy_configuration.gain_dB))  # gain_dB
        config_data.append(
            str(self.legacy_configuration.spectrogram_normalization)
        )  # spectro_normalization
        config_data.append(
            str(self.legacy_configuration.zscore_duration)
        )  # zscore_duration
        config_data.append(str(self.legacy_configuration.window_type))  # window_type
        config_data.append(
            str(self.legacy_configuration.frequency_resolution)
        )  # frequency_resolution
        config_data.append(
            str(self.legacy_configuration.temporal_resolution)
        )  # temporal_resolution
        config_data.append(
            str(self.legacy_configuration.file_overlap)
        )  # audio_file_dataset_overlap
        data.append(config_data)

        return "\n".join([",".join(line) for line in data])

    def get_osekit_spectro_dataset_serialized_path(self) -> Path:
        """Get OSEkit dataset object"""
        return Path(
            join(
                settings.VOLUMES_ROOT,
                settings.DATASET_EXPORT_PATH,
                self.dataset.path,
                self.path,
                f"{self.name}.json",
            )
        )

    @transaction.atomic
    def add_spectrograms(self, spectrograms: list["Spectrogram"]):
        """Add spectrogram objects to current analysis"""
        existing_spectrograms = []
        new_spectrograms = []
        dataset_spectrograms = self.spectrograms.model.objects.filter(
            analysis__dataset=self.dataset
        )

        for s in spectrograms:
            params = {
                "filename": s.filename,
                "format": s.format,
                "start": s.start,
                "end": s.end,
            }
            if dataset_spectrograms.filter(**params).exists():
                existing_spectrograms.append(
                    dataset_spectrograms.filter(**params).first()
                )
            else:
                new_spectrograms.append(s)

        new_spectrograms: list[
            "Spectrogram"
        ] = self.spectrograms.model.objects.bulk_create(
            new_spectrograms, ignore_conflicts=True
        )
        spectrogram_analysis_rel = []
        spectrograms = existing_spectrograms + new_spectrograms
        for spectrogram in spectrograms:
            spectrogram.save()
            spectrogram_analysis_rel.append(
                self.spectrograms.through(spectrogram=spectrogram, analysis=self)
            )

        self.spectrograms.through.objects.bulk_create(spectrogram_analysis_rel)

        self.update_dates()

    def update_dates(self):
        """Update start and end dates based on spectrogram data"""
        info = self.spectrograms.aggregate(start=Min("start"), end=Max("end"))
        self.start = info["start"]
        self.end = info["end"]
        self.save()
