from backend.api.models import Spectrogram
from backend.storage.types import (
    StorageDataset,
    StorageFolder,
    StorageAnalysis,
    StorageItem,
)


class AbstractResolver:
    """Abstract Resolver class"""

    __path: str

    @property
    def path(self) -> str:
        """Abstract Resolver path"""
        return self.__path

    def __init__(self, path: str):
        self.__path = path
        super().__init__()

    def get_dataset(self, path: str | None = None) -> StorageDataset | StorageFolder:
        """Returns dataset or folder from storage"""
        return StorageFolder(path=path or self.path)

    def get_analysis(self, path: str | None = None) -> StorageAnalysis | None:
        """Returns analysis from storage"""
        return None

    def get_item(self, path: str | None = None) -> StorageItem:
        """Returns dataset, analysis or folder from storage"""
        return self.get_analysis(path) or self.get_dataset(path)

    def get_child_items(self) -> list[StorageItem]:
        """Returns child items from storage"""
        raise NotImplementedError

    def get_spectrogram_path(self, spectrogram: Spectrogram) -> str | None:
        """Returns path of spectrogram from storage"""
        return None

    def get_audio_path(self, spectrogram: Spectrogram) -> str | None:
        """Returns path of audio from storage"""
        return None
