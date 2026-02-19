from pathlib import Path, PureWindowsPath
from typing import Optional

from django.conf import settings
from osekit.public_api.dataset import (
    Dataset as OSEkitDataset,
    SpectroDataset as OSEkitSpectroDataset,
)

from backend.api.models import Dataset as DatasetModel
from .analysis import Analysis
from .base_resolver import BaseResolver
from .types import LegacyCSVDataset, ImportStatus
from ..nodes import DatasetStorageNode


class Dataset(BaseResolver):

    model: Optional[DatasetModel] = None
    osekit: Optional[OSEkitDataset] = None
    csv: Optional[LegacyCSVDataset] = None

    @property
    def name(self) -> str:
        if self.model:
            return self.model.name
        if self.csv:
            return self.csv["dataset"]
        return super().name

    @property
    def node(self):
        n = DatasetStorageNode()
        n.name = self.name
        n.path = self.path
        n.model = self.model
        n.import_status = self.import_status
        return n

    @property
    def import_status(self) -> bool:
        if self.model:
            available_analysis = [
                a for a in self.browse() if a.import_status == ImportStatus.Available
            ]
            if len(available_analysis) > 0:
                return ImportStatus.Partial
            return ImportStatus.Imported
        return ImportStatus.Available

    def __init__(
        self,
        root=settings.DATASET_EXPORT_PATH,
        path: Optional[str] = None,
        legacy_datasets_in_csv: list[LegacyCSVDataset] = None,
    ):
        # pylint: disable=broad-except
        super().__init__(
            root,
            path,
            [d for d in legacy_datasets_in_csv if d["path"] == path]
            if legacy_datasets_in_csv
            else None,
        )
        self.model = DatasetModel.objects.filter(path=path).first()
        try:
            json_path = self._join(self.path, "dataset.json")
            self.osekit = OSEkitDataset.from_json(
                Path(self._path_to_server(json_path).as_posix())
            )
        except Exception:
            pass
        self.legacy_datasets_in_csv = [
            d for d in self.legacy_datasets_in_csv if d["path"] == self.path
        ]
        self.legacy_dataset_paths = [d["path"] for d in self.legacy_datasets_in_csv]
        if len(self.legacy_datasets_in_csv) == 1:
            self.csv = self.legacy_datasets_in_csv[0]

    def _load_legacy(self):
        super()._load_legacy()
        self.legacy_datasets_in_csv = [
            d for d in self.legacy_datasets_in_csv if d["path"] == self.path
        ]
        self.legacy_dataset_paths = [d["path"] for d in self.legacy_datasets_in_csv]

    def is_legacy(self) -> bool:
        return self.path in self.legacy_dataset_paths

    def browse(self) -> list[Analysis]:
        analysis: list[Analysis] = []
        # Browse legacy datasets
        for d in self.legacy_datasets_in_csv:
            config = f"{d['spectro_duration']}_{d['dataset_sr']}"
            folder_path = self._join(
                self.path,
                f"processed/spectrogram/{config}",
            )
            if not self._exists(folder_path):
                continue
            for item in self._list(folder_path):
                path = self._join(folder_path, item)
                csv_path = self._join(path, "metadata.csv")
                if not self._exists(csv_path):
                    continue
                analysis.append(Analysis(self.root.as_posix(), path, self.path))
        # Browse datasets
        if self.osekit is not None:
            for [_name, d] in self.osekit.datasets.items():
                if d["class"] != OSEkitSpectroDataset.__name__:
                    continue
                path = (
                    PureWindowsPath(d["dataset"].folder)
                    .as_posix()
                    .split(self.path)
                    .pop()
                    .strip("/")
                )
                analysis.append(
                    Analysis(
                        self.root.as_posix(),
                        self._join(self.path, path),
                        self.path,
                        d["dataset"],
                    )
                )
        return analysis

    def get_analysis(self, name: str) -> Optional[Analysis]:
        for a in self.browse():
            if a.name == name:
                return a
        return None


__all__ = [
    "Dataset",
]
