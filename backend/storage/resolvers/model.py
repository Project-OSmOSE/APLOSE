import csv
from ast import literal_eval
from pathlib import PureWindowsPath, Path
from typing import Tuple, Optional

from django.db.models import F, Min, Max
from django.db.models.functions import Concat
from graphql import GraphQLError
from metadatax.data.models import FileFormat

from backend.api.models import (
    Dataset,
    SpectrogramAnalysis,
    Colormap,
    FFT,
    Spectrogram,
    LegacySpectrogramConfiguration,
    LinearScale,
    MultiLinearScale,
)
from backend.api.models.data.scales import get_frequency_scales
from backend.aplose.models import User
from backend.utils.osekit_replace import SpectroDataset, TFile
from .osekit import OSEkitResolver, AbstractOSEkitResolver
from .storage import StorageResolver
from ..types import StorageDataset, ImportStatus, StorageAnalysis

_all__ = ["ModelResolver"]


class ModelResolver:
    """Resolver class for api.Model related content"""

    @staticmethod
    def get(path: str):
        """Get model resolver"""
        return ModelResolver(storage=StorageResolver.get(), path=path)

    storage: StorageResolver
    osekit: AbstractOSEkitResolver
    path: str

    dataset: Dataset | None
    analysis: SpectrogramAnalysis

    def __init__(self, storage: StorageResolver, path: str):
        self.storage = storage
        self.path = storage.clean_path(path)
        self.osekit = OSEkitResolver.get(self.path)

        self.dataset = self.__get_dataset(self.path)
        self.analysis = self.get_analysis(self.path)

    def __get_dataset(self, path: str) -> Dataset | None:
        return Dataset.objects.filter(path=self.storage.format_path(path)).first()

    def get_analysis(self, path: str) -> SpectrogramAnalysis | None:
        """Get analysis model"""
        return (
            SpectrogramAnalysis.objects.annotate(
                complete_path=Concat(F("path"), F("dataset__path"))
            )
            .filter(complete_path=self.storage.format_path(path))
            .first()
        )

    def get_or_create_dataset(self, owner: User) -> Dataset:
        """Get or create dataset model"""
        if not self.dataset:
            self.dataset = Dataset.objects.create(
                name=self.storage.get_folder_name(self.path),
                path=self.storage.format_path(self.path),
                owner=owner,
                legacy=self.osekit.legacy,
            )
        return self.dataset

    def __create_analysis(
        self, owner: User, name: str
    ) -> Tuple[SpectrogramAnalysis, SpectroDataset]:
        """Get or create analysis model"""
        spectro_dataset = next(a for a in self.osekit.all_analysis if a.name == name)

        if spectro_dataset is None:
            raise GraphQLError("Analysis not found")

        colormap, _ = Colormap.objects.get_or_create(
            name=spectro_dataset.colormap or "viridis"
        )
        dynamic_min = [d.v_lim[0] for d in spectro_dataset.data]
        dynamic_max = [d.v_lim[1] for d in spectro_dataset.data]
        fft, _ = FFT.objects.get_or_create(
            nfft=spectro_dataset.fft.mfft,
            window_size=spectro_dataset.fft.win.size,
            overlap=1 - (spectro_dataset.fft.hop / spectro_dataset.fft.win.size),
            sampling_frequency=spectro_dataset.fft.fs,
            scaling=spectro_dataset.fft.scaling,
            legacy=False,
        )
        relative_path = (
            self.storage.clean_path(spectro_dataset.folder)
            .split(self.storage.clean_path(self.dataset.path))
            .pop()
            .strip("/")
        )

        analysis = SpectrogramAnalysis.objects.create(
            dataset=self.dataset,
            name=spectro_dataset.name,
            path=relative_path,
            owner=owner,
            start=spectro_dataset.begin,
            end=spectro_dataset.end,
            data_duration=spectro_dataset.data_duration.seconds,
            fft=fft,
            colormap=colormap,
            dynamic_min=max(set(dynamic_min), key=dynamic_min.count),
            dynamic_max=max(set(dynamic_max), key=dynamic_max.count),
            legacy=self.osekit.legacy,
        )
        if self.osekit.legacy:
            with self.storage.open(
                self.storage.join(self.dataset.path, analysis.path, "metadata.csv")
            ) as csvfile:
                spectro = next(csv.DictReader(csvfile))
            with self.storage.open(
                self.storage.join(
                    self.dataset.path,
                    f"data/audio/{Path(analysis.path).parts[-2]}/metadata.csv",
                )
            ) as csvfile:
                audio = next(csv.DictReader(csvfile))
            custom_frequency_scale: Tuple[
                Optional[LinearScale],
                Optional[MultiLinearScale],
            ] = (None, None)
            if "custom_frequency_scale" in spectro:
                custom_frequency_scale = get_frequency_scales(
                    spectro["custom_frequency_scale"],
                    int(audio["dataset_sr"]),
                )
            LegacySpectrogramConfiguration.objects.create(
                spectrogram_analysis_id=analysis.id,
                folder=Path(analysis.path).parts[-1],
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

        return analysis, spectro_dataset

    def __import_analysis_files(
        self, analysis: SpectrogramAnalysis, spectro_dataset: SpectroDataset
    ):
        files = self.osekit.get_analysis_spectro_files(sd=spectro_dataset)

        img_format, _ = FileFormat.objects.get_or_create(name="png")

        def spectrogram_info_for_file(file: TFile) -> dict:
            return {
                "filename": PureWindowsPath(file.path).name,
                "format": img_format,
                "start": file.begin,
                "end": file.end,
            }

        Spectrogram.objects.bulk_create(
            [Spectrogram(**spectrogram_info_for_file(file)) for file in files],
            ignore_conflicts=True,
        )

        Spectrogram.analysis.through.objects.bulk_create(
            [
                Spectrogram.analysis.through(
                    spectrogram=Spectrogram.objects.get(
                        **spectrogram_info_for_file(file)
                    ),
                    spectrogramanalysis=analysis,
                )
                for file in files
            ]
        )

    def import_analysis(self, owner: User, name: str) -> SpectrogramAnalysis:
        analysis, sd = self.__create_analysis(owner, name)
        self.__import_analysis_files(analysis, sd)
        info = analysis.spectrograms.aggregate(start=Min("start"), end=Max("end"))
        analysis.start = info["start"]
        analysis.end = info["end"]
        analysis.save()
        return analysis

    def get_storage_dataset(self) -> StorageDataset | None:
        if self.dataset is None:
            return None
        status = ImportStatus.Imported
        for analysis in self.osekit.all_analysis:
            if not self.get_analysis(self.storage.clean_path(analysis.folder)):
                status = ImportStatus.Partial
                break
        return StorageDataset.from_model(model=self.dataset, import_status=status)

    def get_storage_analysis(self) -> StorageAnalysis | None:
        if self.analysis is None:
            return None
        return StorageAnalysis.from_model(model=self.analysis)
