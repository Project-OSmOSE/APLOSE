"""Spectrogram analysis model"""
import csv
from ast import literal_eval
from datetime import datetime
from os.path import join
from pathlib import Path
from typing import Optional

from dateutil import parser
from django.conf import settings
from django.db import models
from django.db.models import CheckConstraint, Q
from osekit.core_api.spectro_dataset import SpectroDataset
from typing_extensions import deprecated

from backend.aplose.models import User
from .__abstract_analysis import AbstractAnalysis
from .colormap import Colormap
from .dataset import Dataset
from .fft import FFT
from .legacy_spectrogram_configuration import LegacySpectrogramConfiguration
from .scales import get_frequency_scales, LinearScale, MultiLinearScale


class SpectrogramAnalysisManager(models.Manager):
    """Spectrogram analysis manager"""

    def import_for_dataset(
        self, dataset: Dataset, name: str, path: str, owner: User
    ) -> "SpectrogramAnalysis":
        """Import a dataset for a given dataset"""

        if dataset.legacy:
            # Get metadata
            audio_csv_path = join(
                settings.VOLUMES_ROOT,
                settings.DATASET_EXPORT_PATH,
                dataset.path,
                "data",
                "audio",
                Path(path).parts[-2],  # audio config folder
                "metadata.csv",
            )
            with open(audio_csv_path, encoding="utf-8") as csvfile:
                audio: dict = next(csv.DictReader(csvfile))
            spectrogram_csv_path = join(
                settings.VOLUMES_ROOT,
                settings.DATASET_EXPORT_PATH,
                dataset.path,
                path,
                "metadata.csv",
            )
            with open(spectrogram_csv_path, encoding="utf-8") as csvfile:
                spectro: dict = next(csv.DictReader(csvfile))

            overlap = float(spectro["overlap"])
            fft, _ = FFT.objects.get_or_create(
                nfft=int(spectro["nfft"]),
                window_size=int(spectro["window_size"]),
                overlap=overlap if overlap < 1 else overlap / 100,
                sampling_frequency=audio["dataset_sr"],
                legacy=True,
            )
            colormap, _ = Colormap.objects.get_or_create(name=spectro["colormap"])
            custom_frequency_scale: (
                Optional[LinearScale],
                Optional[MultiLinearScale],
            ) = (None, None)
            if "custom_frequency_scale" in spectro:
                custom_frequency_scale = get_frequency_scales(
                    spectro["custom_frequency_scale"],
                    int(audio["dataset_sr"]),
                )
            sa = SpectrogramAnalysis.objects.create(
                dataset=dataset,
                name=name,
                path=path,
                start=datetime.fromisoformat(audio["start_date"]),
                end=datetime.fromisoformat(audio["end_date"]),
                data_duration=int(audio["audio_file_dataset_duration"]),
                fft=fft,
                colormap=colormap,
                dynamic_min=int(spectro["dynamic_min"]),
                dynamic_max=int(spectro["dynamic_max"]),
                owner=owner,
                legacy=True,
            )
            LegacySpectrogramConfiguration.objects.create(
                spectrogram_analysis_id=sa.id,
                folder=Path(path).parts[-1],
                zoom_level=spectro["zoom_level"],
                hp_filter_min_frequency=spectro["hp_filter_min_freq"],
                data_normalization=spectro["data_normalization"],
                spectrogram_normalization=spectro["spectro_normalization"],
                zscore_duration=spectro["zscore_duration"]
                if spectro["data_normalization"] == "zscore"
                else None,
                window_type=spectro["window_type"],
                peak_voltage=spectro["peak_voltage"]
                if spectro["data_normalization"] == "instrument"
                and "peak_voltage" in spectro
                else None,
                sensitivity_dB=spectro["sensitivity_dB"]
                if spectro["data_normalization"] == "instrument"
                and "sensitivity_dB" in spectro
                else None,
                frequency_resolution=spectro["frequency_resolution"]
                if "frequency_resolution" in spectro
                else None,
                temporal_resolution=spectro["temporal_resolution"]
                if "temporal_resolution" in spectro
                else None,
                linear_frequency_scale=custom_frequency_scale[0],
                multi_linear_frequency_scale=custom_frequency_scale[1],
                audio_files_subtypes=literal_eval(audio["sample_bits"]),
                channel_count=audio["channel_count"],
            )
            return sa

        sd = SpectroDataset.from_json(
            Path(
                join(
                    settings.VOLUMES_ROOT,
                    settings.DATASET_EXPORT_PATH,
                    dataset.path,
                    path,
                    f"{name}.json",
                )
            )
        )
        colormap, _ = Colormap.objects.get_or_create(name=sd.colormap)
        dynamic_min = [d.v_lim[0] for d in sd.data]
        dynamic_max = [d.v_lim[1] for d in sd.data]
        fft, _ = FFT.objects.get_or_create(
            nfft=sd.fft.mfft,
            window_size=sd.fft.win.size,
            overlap=1 - (sd.fft.hop / sd.fft.win.size),
            sampling_frequency=sd.fft.fs,
            scaling=sd.fft.scaling,
            legacy=False,
        )
        return SpectrogramAnalysis.objects.create(
            dataset=dataset,
            name=sd.name,
            path=path,
            owner=owner,
            start=sd.begin,
            end=sd.end,
            data_duration=sd.data_duration.seconds,
            fft=fft,
            colormap=colormap,
            dynamic_min=max(set(dynamic_min), key=dynamic_min.count),
            dynamic_max=max(set(dynamic_max), key=dynamic_max.count),
        )


class SpectrogramAnalysis(AbstractAnalysis, models.Model):
    """Spectrogram analysis"""

    objects = SpectrogramAnalysisManager()

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

    def get_osekit_spectro_dataset(self) -> SpectroDataset:
        """Get OSEkit dataset object"""
        return SpectroDataset.from_json(
            self.get_osekit_spectro_dataset_serialized_path()
        )

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
