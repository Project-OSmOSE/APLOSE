import csv
from ast import literal_eval
from functools import reduce
from pathlib import PureWindowsPath
from typing import TypedDict

from django.conf import settings
from metadatax.data.models import FileFormat
from pandas import Timestamp, Timedelta

from backend.api.models import (
    SpectrogramAnalysis,
    Dataset,
    FFT,
    Colormap,
    LegacySpectrogramConfiguration,
    LinearScale,
    MultiLinearScale,
    Spectrogram,
)
from backend.storage.types import (
    FailedItem,
)
from backend.storage.utils import (
    exists,
    open_file,
    join,
    listdir,
    make_path_relative,
    make_static_url,
)
from ._storage import StorageResolver


class LegacyCSVDataset(TypedDict):
    dataset: str
    path: str
    spectro_duration: str
    dataset_sr: str


class LegacyCSVTimestamp(TypedDict):
    timestamp: Timestamp
    filename: str


class LegacyCSVAudioMetadata(TypedDict):
    sample_bits: str
    channel_count: str


class LegacyCSVSpectroMetadata(TypedDict):
    overlap: str
    nfft: str
    window_size: str
    dynamic_min: str
    dynamic_max: str
    colormap: str
    zoom_level: str
    custom_frequency_scale: str
    hp_filter_min_freq: str
    data_normalization: str
    spectro_normalization: str
    zscore_duration: str
    data_normalization: str
    window_type: str
    peak_voltage: str
    sensitivity_dB: str
    frequency_resolution: str
    temporal_resolution: str


# noinspection DuplicatedCode
class LegacyOSEkitResolver(StorageResolver):

    __csv_datasets: list[LegacyCSVDataset] | None = []

    # Read CSV
    def _load_csv_datasets(self):
        # Load datasets.csv
        self.__csv_datasets = []
        if exists(settings.DATASET_FILE):
            with open_file(settings.DATASET_FILE) as csvfile:
                dataset: LegacyCSVDataset
                for dataset in csv.DictReader(csvfile):
                    if (
                        "dataset" not in dataset
                        or "path" not in dataset
                        or "spectro_duration" not in dataset
                        or "dataset_sr" not in dataset
                    ):
                        continue
                    duplicates = [
                        d
                        for d in self.__csv_datasets
                        if d["path"] == dataset["path"]
                        and d["spectro_duration"] == dataset["spectro_duration"]
                        and d["dataset_sr"] == dataset["dataset_sr"]
                    ]
                    if len(duplicates) == 0:
                        self.__csv_datasets.append(dataset)

    def _get_csv_datasets(self, path: str) -> list[LegacyCSVDataset]:
        if not self.__csv_datasets:
            self._load_csv_datasets()
        return [
            line
            for line in self.__csv_datasets
            if reduce(
                lambda is_in, part: is_in and part in PureWindowsPath(path).parts,
                PureWindowsPath(line["path"]).parts,
                True,
            )
        ]

    def _get_csv_dataset(
        self, path: str, dataset_sr: int, spectro_duration: int
    ) -> LegacyCSVDataset | None:
        for line in self._get_csv_datasets(path):
            if (
                int(line["dataset_sr"]) == dataset_sr
                and int(line["spectro_duration"]) == spectro_duration
            ):
                return line
        return None

    @staticmethod
    def _get_timestamps(csv_dataset: LegacyCSVDataset) -> list[LegacyCSVTimestamp]:
        config = f"{csv_dataset['spectro_duration']}_{csv_dataset['dataset_sr']}"
        timestamp_csv = join(csv_dataset["path"], f"data/audio/{config}/timestamp.csv")

        with open_file(timestamp_csv) as csvfile:
            return [
                LegacyCSVTimestamp(
                    timestamp=Timestamp(info["timestamp"]),
                    filename=info["filename"],
                )
                for info in list(csv.DictReader(csvfile))
            ]

    @staticmethod
    def _get_spectro_metadata(
        dataset_path: str, analysis_relative_path: str
    ) -> LegacyCSVSpectroMetadata:
        spectro_metadata_csv = join(
            dataset_path, analysis_relative_path, "metadata.csv"
        )
        with open_file(spectro_metadata_csv) as csvfile:
            # noinspection PyTypeChecker
            return next(csv.DictReader(csvfile))

    @staticmethod
    def _get_audio_metadata(
        dataset_path: str, data_duration: int, sampling_frequency: int
    ) -> LegacyCSVAudioMetadata:
        config = f"{data_duration}_{sampling_frequency}"
        audio_metadata_csv = join(dataset_path, f"data/audio/{config}/metadata.csv")
        with open_file(audio_metadata_csv) as csvfile:
            # noinspection PyTypeChecker
            return next(csv.DictReader(csvfile))

    # Implementations

    def _get_dataset_for_path(
        self, path: str | None = None
    ) -> Dataset | FailedItem | None:
        csv_datasets = self._get_csv_datasets(path)
        if len(csv_datasets) == 0:
            return super()._get_dataset_for_path(path=path)
        if len(csv_datasets) == 1:
            return Dataset(
                name=csv_datasets[0]["dataset"],
                path=csv_datasets[0]["path"],
                legacy=True,
            )
        path = csv_datasets.pop()["path"]
        return Dataset(
            name=PureWindowsPath(path).name,
            path=path,
            legacy=True,
        )

    def _get_all_analysis_for_dataset(
        self, dataset: Dataset, detailed: bool = False
    ) -> list[SpectrogramAnalysis | FailedItem]:
        csv_datasets = self._get_csv_datasets(dataset.path)
        analysis: list[SpectrogramAnalysis | FailedItem] = []
        for line in csv_datasets:
            config = f"{line['spectro_duration']}_{line['dataset_sr']}"
            relative_path = f"processed/spectrogram/{config}"
            base_folder = join(line["path"], relative_path)

            for folder in listdir(base_folder):
                analysis.append(
                    self._get_analysis(
                        dataset=dataset,
                        relative_path=make_path_relative(folder, to=dataset.path),
                    )
                )
        return analysis

    def _get_analysis(
        self, dataset: Dataset, relative_path: str, detailed: bool = False
    ) -> SpectrogramAnalysis | FailedItem | None:
        # pylint: disable=broad-exception-caught
        full_path = PureWindowsPath(join(dataset.path, relative_path))
        name = f"{full_path.parent.name}/{full_path.name}"
        csv_datasets = self._get_csv_datasets(
            path=full_path.as_posix(),
        )
        if len(csv_datasets) == 0:
            return None

        try:
            data_duration, sampling_frequency = [
                int(i) for i in full_path.parent.name.split("_")
            ]
        except Exception as e:
            return FailedItem(path=relative_path, name=name, error=e)
        csv_dataset = next(
            line
            for line in csv_datasets
            if int(line["dataset_sr"]) == sampling_frequency
            and int(line["spectro_duration"]) == data_duration
        )
        if csv_dataset is None:
            return None

        try:
            timestamps = self._get_timestamps(csv_dataset)
            metadata = self._get_spectro_metadata(
                dataset_path=dataset.path,
                analysis_relative_path=relative_path,
            )
        except Exception as e:
            return FailedItem(path=relative_path, name=name, error=e)

        return SpectrogramAnalysis(
            name=name,
            path=relative_path,
            legacy=True,
            start=min(i["timestamp"] for i in timestamps),
            end=max(i["timestamp"] for i in timestamps),
            dataset=dataset,
            data_duration=data_duration,
            fft=FFT(
                nfft=int(metadata["nfft"]),
                window_size=int(metadata["window_size"]),
                overlap=float(metadata["overlap"]),
                sampling_frequency=sampling_frequency,
                legacy=True,
            ),
            colormap=Colormap(name=metadata["colormap"]),
            dynamic_min=float(metadata["dynamic_min"]),
            dynamic_max=float(metadata["dynamic_max"]),
        )

    @staticmethod
    def get_all_spectrograms_for_analysis(
        analysis: SpectrogramAnalysis,
    ) -> list[Spectrogram]:
        img_format, _ = FileFormat.objects.get_or_create(name="png")
        config = f"{int(analysis.data_duration)}_{analysis.fft.sampling_frequency}"
        timestamp_csv = join(
            analysis.dataset.path, f"data/audio/{config}/timestamp.csv"
        )
        with open_file(timestamp_csv) as csvfile:
            return [
                Spectrogram(
                    format=img_format,
                    filename=PureWindowsPath(info["filename"]).stem,
                    start=Timestamp(info["timestamp"]),
                    end=Timestamp(info["timestamp"])
                    + Timedelta(seconds=analysis.data_duration),
                )
                for info in list(csv.DictReader(csvfile))
            ]

    def create_legacy_configuration(self, analysis: SpectrogramAnalysis):
        """Create legacy configuration object for analysis"""
        if not analysis.legacy:
            return None
        metadata = self._get_spectro_metadata(analysis.dataset.path, analysis.path)
        audio = self._get_audio_metadata(
            dataset_path=analysis.dataset.path,
            data_duration=int(analysis.data_duration),
            sampling_frequency=analysis.fft.sampling_frequency,
        )

        linear_scale: LinearScale | None = None
        multilinear_scale: MultiLinearScale | None = None
        if "custom_frequency_scale" in metadata:
            scale_name = metadata["custom_frequency_scale"]
            if scale_name.lower() == "porp_delph":
                (
                    multilinear_scale,
                    is_created,
                ) = MultiLinearScale.objects.get_or_create(name="porp_delph")
                if is_created:
                    multilinear_scale.inner_scales.add(
                        LinearScale.objects.get_or_create(
                            ratio=0.5, min_value=0, max_value=30_000
                        )[0]
                    )
                    multilinear_scale.inner_scales.add(
                        LinearScale.objects.get_or_create(
                            ratio=0.7, min_value=30_000, max_value=80_000
                        )[0]
                    )
                    multilinear_scale.inner_scales.add(
                        LinearScale.objects.get_or_create(
                            ratio=1,
                            min_value=80_000,
                            max_value=analysis.fft.sampling_frequency / 2,
                        )[0]
                    )
            elif scale_name.lower() == "dual_lf_hf":
                (
                    multilinear_scale,
                    is_created,
                ) = MultiLinearScale.objects.get_or_create(name="dual_lf_hf")
                if is_created:
                    multilinear_scale.inner_scales.add(
                        LinearScale.objects.get_or_create(
                            ratio=0.5, min_value=0, max_value=22_000
                        )[0]
                    )
                    multilinear_scale.inner_scales.add(
                        LinearScale.objects.get_or_create(
                            ratio=1,
                            min_value=100_000,
                            max_value=analysis.fft.sampling_frequency / 2,
                        )[0]
                    )
            elif scale_name.lower() == "audible":
                linear_scale = LinearScale(
                    name="audible", min_value=0, max_value=22_000
                )

        LegacySpectrogramConfiguration.objects.create(
            spectrogram_analysis=analysis,
            folder=PureWindowsPath(analysis.path).parts[-1],
            zoom_level=int(metadata["zoom_level"]),
            hp_filter_min_frequency=metadata["hp_filter_min_freq"],
            data_normalization=metadata["data_normalization"],
            spectrogram_normalization=metadata["spectro_normalization"],
            zscore_duration=metadata["zscore_duration"]
            if metadata["data_normalization"] == "zscore"
            else None,
            window_type=metadata["window_type"],
            peak_voltage=metadata["peak_voltage"]
            if metadata["data_normalization"] == "instrument"
            and "peak_voltage" in metadata
            else None,
            sensitivity_dB=metadata["sensitivity_dB"]
            if metadata["data_normalization"] == "instrument"
            and "sensitivity_dB" in metadata
            else None,
            frequency_resolution=metadata["frequency_resolution"]
            if "frequency_resolution" in metadata
            else None,
            temporal_resolution=metadata["temporal_resolution"]
            if "temporal_resolution" in metadata
            else None,
            linear_frequency_scale=linear_scale,
            multi_linear_frequency_scale=multilinear_scale,
            audio_files_subtypes=literal_eval(audio["sample_bits"]),
            channel_count=int(audio["channel_count"]),
        )
        return None

    def get_spectrogram_paths(
        self, spectrogram: Spectrogram, analysis: SpectrogramAnalysis
    ) -> tuple[str | None, str | None]:
        config = PureWindowsPath(analysis.path).parts[-2]
        return (
            make_static_url(
                join(
                    analysis.dataset.path,
                    "data/audio",
                    config,
                    f"{spectrogram.filename}.wav",
                )
            ),
            make_static_url(
                join(
                    analysis.dataset.path,
                    analysis.path,
                    "image",
                    f"{spectrogram.filename}.png",
                )
            ),
        )
