import csv
import traceback
from pathlib import PureWindowsPath, Path
from typing import TypedDict

from django.conf import settings
from numpy import hamming
from osekit.config import TIMESTAMP_FORMAT_EXPORTED_FILES_LOCALIZED
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
                                v_lim=(0, 0),
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
                                    v_lim=(
                                        float(metadata["dynamic_min"]),
                                        float(metadata["dynamic_max"]),
                                    ),
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
    _is_legacy: bool = False

    __dataset: OSEkitDataset | None = None
    __spectro_dataset: SpectroDataset | None = None

    __error: tuple[Exception, str] = ()

    @property
    def spectro_dataset(self) -> SpectroDataset | None:
        return self.__spectro_dataset

    def __init__(self, storage: StorageResolver):
        self.__storage = storage
        self.__legacy = OSEkitLegacyResolver(storage)
        super().__init__(storage.path)

        self.__dataset, self._is_legacy, self.__error = self._get_osekit_dataset(
            self.path, deep=True
        )
        if self.__dataset:
            self.__spectro_dataset = self.__get_spectro_dataset(self.path)

    def _get_osekit_dataset(
        self, path: str | None = None, deep: bool = False
    ) -> tuple[OSEkitDataset | None, bool, tuple[Exception, str] | None]:
        path = path or self.path
        json_path = join(path, "dataset.json")
        if exists(json_path):
            try:
                return (
                    OSEkitDataset.from_json(Path(make_absolute_server(json_path))),
                    False,
                    None,
                )
            except FileNotFoundError as e:
                return None, False, (e, traceback.format_exc())
        d = self.__legacy.get_osekit_dataset(path)
        if d:
            return d, True, None
        if deep and not is_local_root(path):
            return self._get_osekit_dataset(
                clean_path(PureWindowsPath(path).parent), deep=True
            )
        return None, False, None

    def get_all_spectro_dataset(
        self, dataset_path: str | None = None
    ) -> list[SpectroDataset]:
        if dataset_path is None:
            dataset = self.__dataset
        else:
            dataset = self._get_osekit_dataset(dataset_path)[0]

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
            return self.__spectro_dataset
        for sd in self.get_all_spectro_dataset():
            if make_path_relative(sd.folder) == path:
                return sd
        return None

    def get_dataset(self, path: str | None = None) -> StorageDataset | StorageFolder:
        if path is None:
            dataset = self.__dataset
            error = self.__error
        else:
            dataset, _, error = self._get_osekit_dataset(path=path)
        if error is not None:
            return StorageDataset(
                path=make_path_relative(path), error=str(error[0]), stack=error[1]
            )
        if dataset is None:
            return self.__storage.get_dataset(path)

        return StorageDataset(path=make_path_relative(dataset.folder))

    def get_analysis(
        self, path: str | None = None, spectro_dataset: SpectroDataset | None = None
    ) -> StorageAnalysis | None:

        if path:
            sd = self.__get_spectro_dataset(path=path)
        elif spectro_dataset:
            sd = spectro_dataset
        else:
            sd = self.__spectro_dataset

        if sd is None:
            return self.__storage.get_analysis()

        return StorageAnalysis(
            path=make_path_relative(
                sd.folder,
                to=make_path_relative(self.__dataset.folder),
            ),
        )

    def get_child_items(self) -> list[StorageItem]:
        if self.__spectro_dataset:
            raise CannotGetChildrenException(self.path)
        if self.__dataset:
            return [
                self.get_analysis(spectro_dataset=sd)
                for sd in self.get_all_spectro_dataset()
            ]
        return self.__storage.get_child_items()

    def _get_analysis_spectro_files(
        self, spectro_dataset: SpectroDataset | None = None
    ) -> list[TFile]:
        spectro_dataset = spectro_dataset or self.__spectro_dataset
        if not spectro_dataset:
            return []
        return (
            [
                TFile(
                    begin=d.begin,
                    end=d.end,
                    path=join(
                        clean_path(spectro_dataset.folder),
                        f"{d.begin.strftime(TIMESTAMP_FORMAT_EXPORTED_FILES_LOCALIZED)}.png",
                    ),
                )
                for d in spectro_dataset.data
            ]
            if not self._is_legacy
            else self.__legacy.get_analysis_spectro_files(spectro_dataset)
        )

    def get_spectrogram_path(self, spectrogram: Spectrogram) -> str | None:
        for file in self._get_analysis_spectro_files():
            if PureWindowsPath(file.path).name == spectrogram.filename:
                return make_static_url(file.path)
        return None

    def get_audio_path(self, spectrogram: Spectrogram) -> str | None:
        for spectro_data in self.__spectro_dataset.data:
            for file in spectro_data.audio_data.files:
                if PureWindowsPath(file.path).name == spectrogram.filename:
                    return make_static_url(file.path)
        return None
