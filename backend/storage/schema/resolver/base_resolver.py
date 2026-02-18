import csv
from io import TextIOWrapper
from os import listdir
from os.path import join, exists, isfile
from pathlib import PureWindowsPath
from typing import Optional

from django.conf import settings

from backend.api.models import Dataset as DatasetModel
from .exceptions import InexistentPathException, FileFolderException
from .types import LegacyCSVDataset


class BaseResolver:

    root: PureWindowsPath
    path: str
    legacy_datasets_in_csv: list[LegacyCSVDataset]
    legacy_dataset_paths: list[str] = []

    @property
    def name(self) -> str:
        return PureWindowsPath(self.path).stem

    @property
    def node(self):
        return None

    def __init__(
        self,
        root: Optional[str] = None,
        path: Optional[str] = None,
        legacy_datasets_in_csv: list[LegacyCSVDataset] = None,
        legacy_dataset_paths: list[str] = None,
    ):
        self.root = PureWindowsPath(root or "")
        self.path = path or ""
        if not self._exists(path):
            raise InexistentPathException(path)
        if self._isfile(path):
            raise FileFolderException(path)
        if legacy_datasets_in_csv is None:
            self._load_legacy()
        else:
            self.legacy_datasets_in_csv = legacy_datasets_in_csv
            self.legacy_dataset_paths = legacy_dataset_paths or (
                [d["path"] for d in legacy_datasets_in_csv]
                if legacy_datasets_in_csv
                else []
            )
        super().__init__()

    root: PureWindowsPath
    path: str

    def _path_to_server(self, path: Optional[str] = None) -> PureWindowsPath:
        server_path = join(settings.VOLUMES_ROOT, self.root.as_posix())
        if path:
            server_path = join(settings.VOLUMES_ROOT, self.root.as_posix(), path)
        return PureWindowsPath(str(server_path))

    def _list(self, path: str) -> list[str]:
        return listdir(self._path_to_server(path))

    def _list_folders(self, path: str) -> list[str]:
        return [
            item
            for item in self._list(path)
            if self._exists(join(path, item))
            if not self._isfile(join(path, item))
        ]

    def _isfile(self, path: str) -> bool:
        return isfile(self._path_to_server(path))

    def _exists(self, path: str) -> bool:
        return exists(self._path_to_server(path))

    def _open(self, path: str) -> TextIOWrapper:
        return open(self._path_to_server(path), encoding="utf-8")

    def _join(self, a: str, *paths: str) -> str:
        return PureWindowsPath(join(a, *paths)).as_posix()

    def is_dataset(self, path: Optional[str] = None) -> bool:
        if path is None:
            path = self.path or ""

        json_file = self._join(path, "dataset.json")
        return (
            path in self.legacy_dataset_paths
            or self._exists(json_file)
            or DatasetModel.objects.filter(path=path).exists()
        )

    def browse(self) -> list:
        return []

    def _load_legacy(self):
        self.legacy_datasets_in_csv = []
        self.legacy_dataset_paths = []
        if not self._exists(settings.DATASET_FILE):
            return
        with self._open(settings.DATASET_FILE) as csvfile:
            dataset: LegacyCSVDataset
            for dataset in csv.DictReader(csvfile):
                if (
                    "dataset" not in dataset
                    or "path" not in dataset
                    or "spectro_duration" not in dataset
                    or "dataset_sr" not in dataset
                ):
                    return
                duplicates = [
                    d
                    for d in self.legacy_datasets_in_csv
                    if d["path"] == dataset["path"]
                    and d["spectro_duration"] == dataset["spectro_duration"]
                    and d["dataset_sr"] == dataset["dataset_sr"]
                ]
                if len(duplicates) == 0:
                    self.legacy_datasets_in_csv.append(dataset)
                if dataset["path"] not in self.legacy_dataset_paths:
                    self.legacy_dataset_paths.append(dataset["path"])


__all__ = [
    "BaseResolver",
]
