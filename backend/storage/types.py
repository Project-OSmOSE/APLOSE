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

    def __init__(self, path: str, name: str | None = None):
        path = PureWindowsPath(path)
        self.path = path.as_posix()
        self.name = name or path.name


class StorageDataset(Folder):
    import_status: ImportStatus
    model: type[Dataset]

    def __init__(
        self,
        path: str,
        import_status: ImportStatus = ImportStatus.Available,
        model: type[Dataset] | None = None,
        name: str | None = None,
    ):
        super().__init__(path, name)
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
    ):
        super().__init__(path, name)
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


__all__ = [
    "Folder",
    "StorageDataset",
    "StorageAnalysis",
    "ImportStatus",
]
