import traceback
from pathlib import PureWindowsPath

from backend.api.models import Dataset, SpectrogramAnalysis


class Folder:
    path: str
    name: str
    error: str | None = None
    stack: str | None = None

    def __init__(
        self,
        path: str,
        name: str | None = None,
        error: Exception | None = None,
        stack: str | None = None,
    ):
        path = PureWindowsPath(path)
        self.path = path.as_posix()
        self.name = name or path.name
        self.error = str(error) if error else None
        self.stack = stack


class StorageFolder(Folder):
    pass


class StorageDataset(Folder):
    model: type[Dataset] | None = None

    def __init__(
        self,
        path: str,
        model: type[Dataset] | None = None,
        name: str | None = None,
        error: str | None = None,
        stack: str | None = None,
    ):
        super().__init__(path, name, error, stack)
        self.model = model

    @staticmethod
    def from_model(model: Dataset):
        return StorageDataset(
            name=model.name,
            path=model.path,
            model=model,
        )


class StorageAnalysis(Folder):
    model: type[SpectrogramAnalysis]

    def __init__(
        self,
        path: str,
        model: type[SpectrogramAnalysis] | None = None,
        name: str | None = None,
        error: str | None = None,
        stack: str | None = None,
    ):
        super().__init__(path, name, error, stack)
        self.model = model

    @staticmethod
    def from_model(model: SpectrogramAnalysis):
        return StorageAnalysis(
            name=model.name,
            path=model.path,
            model=model,
        )


class FailedItem:
    path: str
    name: str
    error: Exception
    stacktrace: str

    def __init__(self, path: str, error: Exception, name: str | None = None):
        self.path = path
        self.name = name if name else PureWindowsPath(self.path).name
        self.error = error
        self.stacktrace = traceback.format_exc()

    @property
    def __storage_options(self) -> dict:
        return {
            "path": self.path,
            "name": self.name,
            "error": f"{self.error.__class__.__name__}: {self.error}",
            "stack": self.stacktrace,
        }

    def to_storage_dataset(self) -> StorageDataset:
        return StorageDataset(**self.__storage_options)

    def to_storage_analysis(self) -> StorageAnalysis:
        return StorageAnalysis(**self.__storage_options)


StorageItem = StorageFolder | StorageDataset | StorageAnalysis

__all__ = [
    "StorageFolder",
    "StorageDataset",
    "StorageAnalysis",
    "StorageItem",
    "FailedItem",
]
