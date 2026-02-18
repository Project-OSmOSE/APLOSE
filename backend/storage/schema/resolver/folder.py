from typing import Union, Optional

from . import LegacyCSVDataset
from .base_resolver import BaseResolver
from .dataset import Dataset
from ..nodes import FolderNode


class Folder(BaseResolver):
    @property
    def node(self):
        n = FolderNode()
        n.name = self.name
        n.path = self.path
        return n

    def browse(self) -> list[Union["Folder", Dataset]]:
        datalist: list = []
        for item in self._list_folders(self.path):
            path = self._join(self.path, item)

            if self.is_dataset(path):
                data = Dataset(
                    self.root,
                    path,
                    self.legacy_datasets_in_csv,
                )
            else:
                data = Folder(
                    self.root,
                    path,
                    self.legacy_datasets_in_csv,
                    self.legacy_dataset_paths,
                )
            datalist.append(data)
        return datalist


__all__ = [
    "Folder",
]
