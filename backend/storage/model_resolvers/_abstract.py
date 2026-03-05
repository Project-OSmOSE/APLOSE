from pathlib import PureWindowsPath

from backend.api.models import Dataset, SpectrogramAnalysis, Spectrogram
from backend.storage.exceptions import CannotGetChildrenException
from backend.storage.types import (
    StorageItem,
    StorageDataset,
    ImportStatus,
    StorageAnalysis,
    FailedItem,
    StorageFolder,
)
from backend.storage.utils import make_path_relative, is_local_root, listdir, isfile


class AbstractResolver:
    """Abstract Resolver class"""

    __path: str

    __dataset: Dataset | FailedItem | None
    __all_analysis: list[SpectrogramAnalysis | FailedItem]
    __analysis: SpectrogramAnalysis | FailedItem | None

    @property
    def path(self) -> str:
        """Path getter"""
        return self.__path

    @property
    def dataset(self) -> Dataset | FailedItem | None:
        """Dataset getter"""
        return self.__dataset

    @property
    def all_analysis(self) -> list[SpectrogramAnalysis | FailedItem]:
        """Analysis list getter"""
        return self.__all_analysis

    @property
    def analysis(self) -> SpectrogramAnalysis | FailedItem | None:
        """Analysis getter"""
        return self.__analysis

    def __init__(self, path: str):
        self.__path = path
        self.__dataset = self.get_dataset(path=self.path)
        try:
            self.__all_analysis = self.get_all_analysis(path=self.path)
        except Exception as e:
            self.__dataset = FailedItem(path=self.path, error=e)
            self.__all_analysis = []
        self.__analysis = self.get_analysis(path=self.path)

    def _get_dataset_for_path(
        self, path: str | None = None
    ) -> Dataset | FailedItem | None:
        return None

    def get_dataset(self, path: str | None = None) -> Dataset | FailedItem | None:
        """Returns dataset from storage"""
        if path is None:
            return self.dataset

        dataset = self._get_dataset_for_path(path=path)

        if dataset:
            return dataset
        if is_local_root(path):
            return None

        return self.get_dataset(path=PureWindowsPath(path).parent.as_posix())

    def _get_all_analysis_for_dataset(
        self, dataset: Dataset
    ) -> list[SpectrogramAnalysis | FailedItem]:
        return []

    def get_all_analysis(
        self, path: str | None = None
    ) -> list[SpectrogramAnalysis | FailedItem]:
        """Returns analysis list from storage"""
        if path is None:
            return self.all_analysis
        dataset = self.get_dataset(path=path)
        if dataset:
            return self._get_all_analysis_for_dataset(dataset=dataset)
        return []

    def get_analysis(
        self, path: str | None = None
    ) -> SpectrogramAnalysis | FailedItem | None:
        """Returns analysis from storage"""
        if path is None:
            return self.__analysis
        dataset = self.get_dataset(path=path)
        if not dataset:
            return None
        path = path or self.path
        relative_path = make_path_relative(path, to=dataset.path)
        try:
            for analysis in self.get_all_analysis(path=path):
                if analysis.path == relative_path:
                    return analysis
        except Exception as e:
            return FailedItem(path=relative_path, error=e)
        return None

    def get_all_spectrograms_for_analysis(
        self, analysis: SpectrogramAnalysis
    ) -> list[Spectrogram]:
        """List spectrograms from analysis"""
        return []

    def _get_storage_analysis_from_spectrogram_analysis(
        self, analysis: SpectrogramAnalysis
    ) -> StorageAnalysis:
        return StorageAnalysis(
            path=analysis.path,
            name=analysis.name,
            import_status=ImportStatus.Available,
        )

    def _get_storage_dataset_from_dataset(self, dataset: Dataset) -> StorageDataset:
        return StorageDataset(
            name=dataset.name,
            path=dataset.path,
            import_status=ImportStatus.Available,
        )

    def get_item(self, path: str | None = None) -> StorageItem | None:
        """Get item from storage"""
        dataset = self.get_dataset(path)
        if not dataset:
            return None

        analysis = self.get_analysis(path=path)
        if analysis:
            if isinstance(analysis, FailedItem):
                return analysis.to_storage_analysis()
            return self._get_storage_analysis_from_spectrogram_analysis(
                analysis=analysis
            )

        if isinstance(dataset, FailedItem):
            return dataset.to_storage_dataset()
        return self._get_storage_dataset_from_dataset(dataset=dataset)

    def get_children_items(self) -> list[StorageItem]:
        """Get children items from storage"""
        dataset = self.get_dataset()
        analysis = self.get_analysis()
        if analysis:
            raise CannotGetChildrenException(self.path)

        if dataset:
            return [
                self._get_storage_analysis_from_spectrogram_analysis(analysis=analysis)
                for analysis in self.get_all_analysis()
            ]

        return [
            self.get_item(path=folder)
            for folder in listdir(self.path)
            if not isfile(folder)
        ]


__all__ = ["AbstractResolver"]
