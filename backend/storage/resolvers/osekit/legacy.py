import csv
from pathlib import Path
from typing import TypedDict, Tuple

from django.conf import settings
from osekit.config import TIMESTAMP_FORMAT_EXPORTED_FILES_LOCALIZED
from pandas import Timestamp, Timedelta
from scipy.signal import ShortTimeFFT
from scipy.signal.windows import hamming
from typing_extensions import deprecated

from .__abstract import AbstractOSEkitResolver
from backend.utils.osekit_replace import (
    OSEkitDataset,
    SpectroDataset,
    SpectroData,
    AudioData,
    TFile,
)


class LegacyCSVDataset(TypedDict):
    dataset: str
    path: str
    spectro_duration: str
    dataset_sr: str


class LegacyCSVAnalysis(LegacyCSVDataset):
    analysis_path: str


@deprecated("Use OSEkitResolver")
class LegacyOSEkitResolver(AbstractOSEkitResolver):
    """Resolver class for OSEkit related content"""

    legacy = True

    def _load_dataset(self, path: str):
        self.dataset = None
        datasets = []
        dataset_path = path
        if not self.storage.exists(settings.DATASET_FILE):
            return None
        with self.storage.open(settings.DATASET_FILE) as csvfile:
            dataset: LegacyCSVDataset
            for dataset in csv.DictReader(csvfile):
                if (
                    "dataset" not in dataset
                    or "path" not in dataset
                    or "spectro_duration" not in dataset
                    or "dataset_sr" not in dataset
                ):
                    continue
                if dataset["path"] not in path:
                    continue
                duplicates = [
                    d
                    for d in datasets
                    if d["path"] == dataset["path"]
                    and d["spectro_duration"] == dataset["spectro_duration"]
                    and d["dataset_sr"] == dataset["dataset_sr"]
                ]
                if len(duplicates) == 0:
                    datasets.append(dataset)
                    dataset_path = dataset["path"]
        if len(datasets) == 0:
            return None

        osekit_datasets: dict = {}
        for d in datasets:
            config = f"{d['spectro_duration']}_{d['dataset_sr']}"
            relative_path = f"processed/spectrogram/{config}"
            folder_path = self.storage.join(d["path"], relative_path)
            if not self.storage.exists(folder_path):
                continue

            audio_timestamp_csv = self.storage.join(
                d["path"], f"data/audio/{config}/timestamp.csv"
            )
            spectro_data: list[SpectroData] = []
            with self.storage.open(audio_timestamp_csv) as csvfile:
                for file in csv.DictReader(csvfile):
                    begin = Timestamp(file["timestamp"])
                    end = begin + Timedelta(seconds=int(d["spectro_duration"]))
                    spectro_data.append(
                        SpectroData(
                            name=file["filename"],
                            begin=begin,
                            end=end,
                            v_lim=[],
                            audio_data=AudioData(
                                files=[
                                    TFile(
                                        begin=begin,
                                        end=end,
                                        path=self.storage.join(
                                            d["path"],
                                            "data/audio",
                                            config,
                                            file["filename"],
                                        ),
                                    )
                                ]
                            ),
                        )
                    )

            for analysis_path in self.storage.list(folder_path):
                metadata_csv = self.storage.join(analysis_path, "metadata.csv")
                if not self.storage.exists(metadata_csv):
                    continue
                with self.storage.open(metadata_csv) as csvfile:
                    metadata = next(csv.DictReader(csvfile))

                name = self.storage.get_folder_name(analysis_path)
                overlap = float(metadata["overlap"])
                if overlap > 1:
                    overlap /= 100
                osekit_datasets[name] = {
                    "class": SpectroDataset.__name__,
                    "analysis": name,
                    "dataset": SpectroDataset(
                        folder=analysis_path,
                        name=name,
                        colormap=metadata["colormap"],
                        fft=ShortTimeFFT(
                            win=hamming(int(metadata["window_size"])),
                            hop=int((1 - overlap) * int(metadata["window_size"])),
                            fs=int(d["dataset_sr"]),
                            mfft=int(metadata["nfft"]),
                        ),
                        data=[
                            SpectroData(
                                name=d.name,
                                begin=d.begin,
                                end=d.end,
                                v_lim=[
                                    int(metadata["dynamic_min"]),
                                    int(metadata["dynamic_max"]),
                                ],
                                audio_data=d.audio_data,
                            )
                            for d in spectro_data
                        ],
                    ),
                }

        self.dataset = OSEkitDataset(
            folder=Path(dataset_path),
            datasets=osekit_datasets,
        )

    def get_analysis(self, path: str) -> SpectroDataset | None:
        """Get analysis for given path"""
        for a in self.all_analysis:
            if self.storage.clean_path(a.folder) == path:
                return a
        return None

    def get_analysis_spectro_files(self, sd: SpectroDataset) -> list[TFile]:
        return [
            TFile(
                begin=d.begin,
                end=d.end,
                path=self.storage.join(
                    self.storage.format_path(sd.folder),
                    f"{d.begin.strftime(TIMESTAMP_FORMAT_EXPORTED_FILES_LOCALIZED)}.png",
                ),
            )
            for d in sd.data
        ]


__all__ = ["LegacyOSEkitResolver"]
