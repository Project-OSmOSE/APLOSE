from enum import Enum
from typing import TypedDict


class LegacyCSVDataset(TypedDict):
    dataset: str
    path: str
    spectro_duration: str
    dataset_sr: str


class LegacyCSVAnalysis(LegacyCSVDataset):
    relative_path: str


class ImportStatus(Enum):
    Unavailable = -1
    Available = 0
    Partial = 1
    Imported = 2


class StorageAnalysis(TypedDict):
    name: str
    path: str


class StorageDataset(TypedDict):
    name: str
    path: str
    legacy: bool | None
    analysis: list[StorageAnalysis]


__all__ = ["LegacyCSVDataset", "LegacyCSVAnalysis", "ImportStatus"]
