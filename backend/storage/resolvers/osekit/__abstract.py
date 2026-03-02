from osekit.config import TIMESTAMP_FORMAT_EXPORTED_FILES_LOCALIZED

from backend.utils.osekit_replace import OSEkitDataset, SpectroDataset, TFile
from ..storage import StorageResolver


class AbstractOSEkitResolver:

    storage: StorageResolver
    legacy = False

    dataset: OSEkitDataset | None = None
    analysis: SpectroDataset | None = None
    all_analysis: list[SpectroDataset] = []

    @property
    def dataset_path(self) -> str | None:
        """Cleaned path of the OSEkit dataset"""
        if self.dataset is None:
            return None
        return self.storage.clean_path(self.dataset.folder)

    def __init__(self, storage: StorageResolver, path: str):
        self.storage = storage
        path = storage.clean_path(path)
        self._load_dataset(path)
        self._load_all_analysis()
        self._load_analysis(path)

    def _load_dataset(self, path: str):
        self.dataset = None

    def _load_all_analysis(self):
        if self.dataset is None:
            self.all_analysis = []
        else:
            self.all_analysis = [
                d["dataset"]
                for d in self.dataset.datasets.values()
                if d["class"] == SpectroDataset.__name__
            ]

    def _load_analysis(self, path: str):
        self.analysis = self.get_analysis(path)

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


__all__ = ["AbstractOSEkitResolver"]
