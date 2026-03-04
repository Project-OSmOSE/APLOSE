import csv
from pathlib import PureWindowsPath, Path
from typing import TypedDict, Tuple

from django.conf import settings
from numpy import hamming
from osekit.config import TIMESTAMP_FORMAT_EXPORTED_FILES_LOCALIZED
from osekit.core_api.spectro_file import SpectroFile
from pandas import Timestamp, Timedelta
from scipy.signal import ShortTimeFFT

from backend.storage.types import (
    StorageAnalysis,
    StorageDataset,
    StorageFolder,
    StorageItem,
)
from backend.storage.utils import (
    exists,
    open_file,
    join,
    listdir,
    make_path_relative,
    make_absolute_server,
    is_local_root,
    clean_path,
    make_static_url,
)
from backend.utils.osekit_replace import (
    SpectroDataset,
    OSEkitDataset,
    SpectroData,
    AudioData,
    TFile,
)
from ._abstract import AbstractResolver
from ._storage import StorageResolver
from ..exceptions import CannotGetChildrenException
from ...api.models import Spectrogram


class LegacyCSVDataset(TypedDict):
    dataset: str
    path: str
    spectro_duration: str
    dataset_sr: str


class OSEkitLegacyResolver:

    __storage: StorageResolver

    __csv_datasets: list[LegacyCSVDataset] = []

    def __init__(self, storage: StorageResolver):
        self.__storage = storage
        super().__init__()

        # Load dataset
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
                    if dataset["path"] not in self.__storage.path:
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

    def get_osekit_dataset(self, path: str) -> OSEkitDataset | None:
        csv_datasets = [line for line in self.__csv_datasets if line["path"] == path]
        dataset = None
        if len(csv_datasets) > 0:
            osekit_datasets: dict = {}
            for d in csv_datasets:
                config = f"{d['spectro_duration']}_{d['dataset_sr']}"
                relative_path = f"processed/spectrogram/{config}"
                folder_path = join(d["path"], relative_path)
                if not exists(folder_path):
                    continue

                audio_timestamp_csv = join(
                    d["path"], f"data/audio/{config}/timestamp.csv"
                )
                spectro_data: list[SpectroData] = []
                with open_file(audio_timestamp_csv) as csvfile:
                    for file in csv.DictReader(csvfile):
                        begin = Timestamp(file["timestamp"])
                        end = begin + Timedelta(seconds=int(d["spectro_duration"]))
                        spectro_data.append(
                            SpectroData(
                                name=PureWindowsPath(file["filename"]).name,
                                begin=begin,
                                end=end,
                                v_lim=[],
                                audio_data=AudioData(
                                    files=[
                                        TFile(
                                            begin=begin,
                                            end=end,
                                            path=join(
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

                for analysis_path in listdir(folder_path):
                    metadata_csv = join(analysis_path, "metadata.csv")
                    if not exists(metadata_csv):
                        continue
                    with open_file(metadata_csv) as csvfile:
                        metadata = next(csv.DictReader(csvfile))

                    name = PureWindowsPath(analysis_path).name
                    overlap = float(metadata["overlap"])
                    if overlap > 1:
                        overlap /= 100
                    osekit_datasets[name] = {
                        "class": SpectroDataset.__name__,
                        "analysis": name,
                        "dataset": SpectroDataset(
                            folder=Path(analysis_path),
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

            dataset = OSEkitDataset(
                folder=Path(csv_datasets[0]["path"]),
                datasets=osekit_datasets,
            )
        return dataset

    def get_analysis_spectro_files(self, sd: SpectroDataset) -> list[TFile]:
        return [
            TFile(
                begin=d.begin,
                end=d.end,
                path=join(
                    make_static_url(sd.folder),
                    "image",
                    f"{d.name}_{1}_{0}.png",
                ),
            )
            for d in sd.data
        ]


class OSEkitResolver(AbstractResolver):

    __storage: StorageResolver

    __legacy: OSEkitLegacyResolver
    __is_legacy: bool = False

    __dataset: OSEkitDataset | None = None
    __analysis: SpectroDataset | None = None

    def __init__(self, storage: StorageResolver):
        self.__storage = storage
        self.__legacy = OSEkitLegacyResolver(storage)
        super().__init__(storage.path)

        self.__load_dataset(self.path)
        if self.__dataset:
            self.__analysis = self.__get_spectro_dataset(self.path)

    def __load_dataset(self, path: str):
        path = "".join(
            path.split("dataset.json")
        )  # Remove potential dataset.json in the path
        self.__dataset, self.__is_legacy = self.__get_osekit_dataset(path)
        if not self.__dataset and not is_local_root(path):
            self.__load_dataset(clean_path(PureWindowsPath(path).parent))

    def __get_osekit_dataset(
        self, path: str | None = None
    ) -> Tuple[OSEkitDataset | None, bool]:
        path = path or self.path
        json_path = join(path, "dataset.json")
        if exists(json_path):
            try:
                return (
                    OSEkitDataset.from_json(Path(make_absolute_server(json_path))),
                    False,
                )
            except FileNotFoundError:
                pass
        d = self.__legacy.get_osekit_dataset(path)
        if d:
            return d, True
        return None, False

    def get_all_spectro_dataset(
        self, dataset_path: str | None = None
    ) -> list[SpectroDataset]:
        if dataset_path is None:
            dataset = self.__dataset
        else:
            dataset = self.__get_osekit_dataset(dataset_path)

        return (
            [
                d["dataset"]
                for d in dataset.datasets.values()
                if isinstance(d["dataset"], SpectroDataset)
            ]
            if dataset
            else []
        )

    def __get_spectro_dataset(self, path: str | None = None) -> SpectroDataset | None:
        if path is None:
            return self.__analysis
        for sd in self.get_all_spectro_dataset():
            if make_path_relative(sd.folder) == path:
                return sd
        return None

    def get_dataset(self, path: str | None = None) -> StorageDataset | StorageFolder:
        if path is None:
            dataset = self.__dataset
        else:
            dataset = self.__get_osekit_dataset(path)
        if dataset is None:
            return self.__storage.get_dataset()

        return StorageDataset(path=make_path_relative(dataset.folder))

    def get_analysis(
        self, path: str | None = None, spectro_dataset: SpectroDataset | None = None
    ) -> StorageAnalysis | None:

        if path:
            sd = self.__get_spectro_dataset(path=path)
        elif spectro_dataset:
            sd = spectro_dataset
        else:
            sd = self.__analysis

        if sd is None:
            return self.__storage.get_analysis()

        return StorageAnalysis(
            path=make_path_relative(
                sd.folder,
                to=make_path_relative(self.__dataset.folder),
            ),
        )

    def get_child_items(self) -> list[StorageItem]:
        if self.__analysis:
            raise CannotGetChildrenException(self.path)
        if self.__dataset:
            return [
                self.get_analysis(spectro_dataset=sd)
                for sd in self.get_all_spectro_dataset()
            ]
        return self.__storage.get_child_items()

    def __get_analysis_spectro_files(self) -> list[TFile]:
        if not self.__analysis:
            return []
        return (
            [
                TFile(
                    begin=d.begin,
                    end=d.end,
                    path=join(
                        clean_path(self.__analysis.folder),
                        f"{d.begin.strftime(TIMESTAMP_FORMAT_EXPORTED_FILES_LOCALIZED)}.png",
                    ),
                )
                for d in self.__analysis.data
            ]
            if not self.__is_legacy
            else self.__legacy.get_analysis_spectro_files(self.__analysis)
        )

    def get_spectrogram_path(self, spectrogram: Spectrogram) -> str | None:
        for file in self.__get_analysis_spectro_files():
            if PureWindowsPath(file.path).name == spectrogram.filename:
                return make_static_url(file.path)
        return None

    def get_audio_path(self, spectrogram: Spectrogram) -> str | None:
        for spectro_data in self.__analysis.data:
            for file in spectro_data.audio_data.files:
                if PureWindowsPath(file.path).name == spectrogram.filename:
                    return make_static_url(file.path)
        return None
