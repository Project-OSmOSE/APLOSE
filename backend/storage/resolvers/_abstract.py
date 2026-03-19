from pathlib import PureWindowsPath

from backend.api.models import Dataset, SpectrogramAnalysis, Spectrogram
from backend.storage.exceptions import (
    CannotGetChildrenException,
)
from backend.storage.enums import ImportStatus
from backend.storage.types import (
    StorageItem,
    StorageDataset,
    StorageAnalysis,
    FailedItem,
    StorageFolder,
)
from backend.storage.utils import make_path_relative, is_local_root, listdir, isfile


class AbstractResolver:
    """Abstract Resolver class"""

    __path: str

    __dataset: Dataset | FailedItem | None = None
    __all_analysis: list[SpectrogramAnalysis | FailedItem] = []
    __analysis: SpectrogramAnalysis | FailedItem | None = None

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

    def __init__(self, path: str | None):
        self.__path = path
        if path is not None:
            self.__dataset = self.get_dataset(path=self.path)
            self.__all_analysis = self.get_all_analysis(path=self.path)
            self.__analysis = self.get_analysis(path=self.path)

    def _get_dataset_for_path(
        self, path: str | None = None
    ) -> Dataset | FailedItem | None:
        return None

    def get_dataset(self, path: str | None = None) -> Dataset | FailedItem | None:
        """Returns dataset from storage"""
        # pylint: disable=assignment-from-none
        if path is None:
            return self.dataset

        dataset = self._get_dataset_for_path(path=path)

        if dataset:
            return dataset
        if is_local_root(path):
            return None

        return self.get_dataset(path=PureWindowsPath(path).parent.as_posix())

    def _get_all_analysis_for_dataset(
        self, dataset: Dataset, detailed: bool = False
    ) -> list[SpectrogramAnalysis | FailedItem]:
        return []

    def get_all_analysis(
        self, path: str | None = None, detailed: bool = False
    ) -> list[SpectrogramAnalysis | FailedItem]:
        """Returns analysis list from storage"""
        if path is None and not detailed:
            return self.all_analysis
        path = self.path
        dataset = self.get_dataset(path=path)
        if not dataset or isinstance(dataset, FailedItem):
            return []
        return self._get_all_analysis_for_dataset(dataset=dataset, detailed=detailed)

    def _get_analysis(
        self, dataset: Dataset, relative_path: str, detailed: bool = False
    ) -> SpectrogramAnalysis | FailedItem | None:
        return None

    def get_analysis(
        self, path: str | None = None, detailed: bool = False
    ) -> SpectrogramAnalysis | FailedItem | None:
        """Returns analysis from storage"""
        if path is None:
            return self.__analysis
        dataset = self.get_dataset(path=path)
        if not dataset:
            return None
        path = path or self.path
        relative_path = make_path_relative(path, to=dataset.path)
        return self._get_analysis(
            dataset=dataset, relative_path=relative_path, detailed=detailed
        )

    def get_all_spectrograms_for_analysis(
        self,
        analysis: SpectrogramAnalysis,
    ) -> list[Spectrogram]:
        """List spectrograms from analysis"""
        return []

    def _get_storage_analysis_from_spectrogram_analysis(
        self, analysis: SpectrogramAnalysis
    ) -> StorageAnalysis:
        return StorageAnalysis(
            path=analysis.path,
            name=analysis.name,
            import_status=ImportStatus.AVAILABLE,
        )

    def _get_storage_dataset_from_dataset(self, dataset: Dataset) -> StorageDataset:
        return StorageDataset(
            name=dataset.name,
            path=dataset.path,
            import_status=ImportStatus.AVAILABLE,
        )

    def get_item(
        self, path: str | None = None, discover_analysis: bool = True
    ) -> StorageItem | None:
        """Get item from storage"""
        dataset = self.get_dataset(path)
        if not dataset:
            return StorageFolder(path=path)

        if discover_analysis:
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
        if analysis and not isinstance(analysis, FailedItem):
            raise CannotGetChildrenException(self.path)

        if dataset:
            return [
                self._get_storage_analysis_from_spectrogram_analysis(analysis=analysis)
                if isinstance(analysis, SpectrogramAnalysis)
                else analysis.to_storage_analysis()
                for analysis in self.get_all_analysis()
            ]

        return [
            self.get_item(path=folder, discover_analysis=False)
            for folder in listdir(self.path)
            if not isfile(folder)
        ]


__all__ = ["AbstractResolver"]
