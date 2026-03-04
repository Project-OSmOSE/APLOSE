import traceback

from backend.storage.exceptions import (
    RootPathException,
    PathNotFoundException,
    CannotGetChildrenException,
)
from backend.storage.types import (
    StorageDataset,
    StorageAnalysis,
    StorageFolder,
    StorageItem,
)
from backend.storage.utils import make_path_relative
from ._abstract import AbstractResolver
from ._model import ModelResolver
from ._osekit import OSEkitResolver
from ._storage import StorageResolver
from ...api.models import Spectrogram


class Resolver(AbstractResolver):
    """Main resolver class for storage"""

    __storage: StorageResolver
    __osekit: OSEkitResolver
    __model: ModelResolver

    # TODO: remove here!!
    #   __error: Exception | None = None
    #   __stack: list[str] | None = None
    #   StorageFolder(
    #       path=self.path,
    #       error=self.__error,
    #       stack="\n".join(self.__stack),
    #   )

    def __init__(self, path: str):
        path = make_path_relative(path)
        self.__storage = StorageResolver(path)
        path = self.__storage.path
        self.__osekit = OSEkitResolver(self.__storage)
        self.__model = ModelResolver(self.__osekit)
        super().__init__(path)

    def get_dataset(self, path: str | None = None) -> StorageDataset | StorageFolder:
        return self.__model.get_dataset(path=path)

    def get_analysis(self, path: str | None = None) -> StorageAnalysis | None:
        return self.__model.get_analysis(path=path)

    def get_child_items(self) -> list[StorageItem]:
        item = self.get_item()
        if isinstance(item, StorageAnalysis):
            raise CannotGetChildrenException(self.path)
        if isinstance(item, StorageDataset):
            return self.__model.get_child_items()
        return [
            self.get_item(folder.path) for folder in self.__storage.get_child_items()
        ]

    def get_spectrogram_path(self, spectrogram: Spectrogram) -> str | None:
        pass

    def get_audio_path(self, spectrogram: Spectrogram) -> str | None:
        return self.__osekit.get_audio_path(spectrogram)


__all__ = ["Resolver"]
