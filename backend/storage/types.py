import traceback
from enum import Enum
from pathlib import PureWindowsPath

from backend.api.models import Dataset, SpectrogramAnalysis


class ImportStatus(Enum):
    Unavailable = -1
    Available = 0
    Partial = 1
    Imported = 2


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
    import_status: ImportStatus | None = None
    model: type[Dataset] | None = None

    def __init__(
        self,
        path: str,
        import_status: ImportStatus = ImportStatus.Available,
        model: type[Dataset] | None = None,
        name: str | None = None,
        error: str | None = None,
        stack: str | None = None,
    ):
        super().__init__(path, name, error, stack)
        self.import_status = import_status
        self.model = model

    @staticmethod
    def from_model(model: Dataset, import_status: ImportStatus):
        return StorageDataset(
            name=model.name,
            path=model.path,
            import_status=import_status,
            model=model,
        )


class StorageAnalysis(Folder):
    import_status: ImportStatus
    model: type[SpectrogramAnalysis]

    def __init__(
        self,
        path: str,
        import_status: ImportStatus = ImportStatus.Available,
        model: type[SpectrogramAnalysis] | None = None,
        name: str | None = None,
        error: str | None = None,
        stack: str | None = None,
    ):
        super().__init__(path, name, error, stack)
        self.import_status = import_status
        self.model = model

    @staticmethod
    def from_model(model: SpectrogramAnalysis):
        return StorageAnalysis(
            name=model.name,
            path=model.path,
            import_status=ImportStatus.Imported,
            model=model,
        )


class FailedItem:
    path: str
    error: Exception
    stacktrace: str

    @property
    def name(self) -> str:
        return PureWindowsPath(self.path).name

    def __init__(self, path: str, error: Exception):
        self.path = path
        self.error = error
        self.stacktrace = traceback.format_exc()

    @property
    def __storage_options(self) -> dict:
        return {
            "path": self.path,
            "name": PureWindowsPath(self.path).name,
            "import_status": ImportStatus.Unavailable,
            "error": str(self.error),
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
    "ImportStatus",
    "FailedItem",
]
